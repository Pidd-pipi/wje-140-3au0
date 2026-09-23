import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { RetirementStatus, VehicleStatus } from '../types/enums';
import { RetireVehiclePayload, RetirementBlocking } from '../types/interfaces';
import { logger } from '../utils/logger';
import { VehicleService } from './vehicle.service';
import { DispatchService } from './dispatch.service';
import { MaintenanceService } from './maintenance.service';

@Injectable()
export class VehicleRetirementService {
  private rows: any[] = [];
  private nextId = 1;

  constructor(
    private readonly vehicleService: VehicleService,
    private readonly dispatchService: DispatchService,
    private readonly maintenanceService: MaintenanceService
  ) {}

  findAll(vehicleId?: number) { return vehicleId === undefined ? this.rows : this.rows.filter((item: any) => item.vehicleId === vehicleId); }
  findOne(id: number) { return this.rows.find((item: any) => item.id === id); }
  findByVehicle(vehicleId: number) { return this.rows.filter((item: any) => item.vehicleId === vehicleId); }

  retire(payload: RetireVehiclePayload) {
    const vehicleId = Number(payload?.vehicleId);
    if (!payload || !Number.isInteger(vehicleId) || vehicleId <= 0) { throw new BadRequestException('vehicleId 必须为正整数'); }
    if (!payload.effectiveDate || isNaN(Date.parse(payload.effectiveDate))) { throw new BadRequestException('effectiveDate 必须为有效日期'); }
    if (!payload.reason || !String(payload.reason).trim()) { throw new BadRequestException('reason 不能为空'); }

    const vehicle: any = this.vehicleService.findOne(vehicleId);
    if (!vehicle) { throw new NotFoundException(`车辆 ${vehicleId} 不存在`); }

    // 幂等：客户端重试（同一 requestId）或同车已办过退役，直接返回既有记录，不重复生成
    if (payload.requestId) {
      const byRequest = this.rows.find((item: any) => item.requestId === payload.requestId);
      if (byRequest) { return byRequest; }
    }
    const existing = this.rows.find((item: any) => item.vehicleId === vehicleId);
    if (existing) { return existing; }

    // 占用核验：已派/执行中的调度、待开始/进行中的维保；存在则返回具体单据，车辆保持原状态
    const blocking: RetirementBlocking = {
      dispatchOrders: this.dispatchService.findActiveByVehicle(vehicleId),
      maintenanceRecords: this.maintenanceService.findActiveByVehicle(vehicleId)
    };
    if (blocking.dispatchOrders.length > 0 || blocking.maintenanceRecords.length > 0) {
      throw new ConflictException({ message: '车辆存在已派/执行中的调度或待开始/进行中的维保，无法办理退役', blocking });
    }

    // 核验通过与落库在同一同步区间内完成，并发请求只会有一个通过；接入数据库后应改为事务 + vehicleId 唯一索引
    const record = {
      id: this.nextId++,
      vehicleId,
      effectiveDate: payload.effectiveDate,
      reason: String(payload.reason).trim(),
      status: RetirementStatus.Effective,
      requestId: payload.requestId,
      createdAt: new Date().toISOString()
    };
    this.rows.push(record);
    this.vehicleService.updateStatus(vehicleId, VehicleStatus.Retired);
    logger.info(`[audit] vehicle ${vehicleId} retired, retirementId=${record.id}, effectiveDate=${record.effectiveDate}`);
    return record;
  }
}
