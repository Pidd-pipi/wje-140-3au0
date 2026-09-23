import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { DispatchService } from './dispatch.service';
import { MaintenanceService } from './maintenance.service';
import { VehicleStatus } from '../types/enums';
import { RetirementOccupation, RetirementRecord, RetirementRequest } from '../types/interfaces';

@Injectable()
export class RetirementService {
  private rows: RetirementRecord[] = [];

  constructor(
    private readonly vehicleService: VehicleService,
    private readonly dispatchService: DispatchService,
    private readonly maintenanceService: MaintenanceService,
  ) {}

  findAll() { return this.rows; }
  findOne(id: number) { return this.rows.find((item) => item.id === id); }
  findByVehicleId(vehicleId: number) { return this.rows.filter((item) => item.vehicleId === vehicleId); }

  /**
   * 退役办理：
   * 1. 核对车辆存在；
   * 2. 无已派/执行中调度，无待开始/进行中维保——有占用则带具体单据抛 409，车辆保持原状态；
   * 3. 重复或并发办理幂等，只留一份退役记录。
   */
  submit(payload: RetirementRequest): RetirementRecord {
    const { vehicleId, effectiveDate, reason } = payload;
    const vehicle = this.vehicleService.findOne(Number(vehicleId));
    if (!vehicle) {
      throw new NotFoundException({ message: '车辆不存在', data: { vehicleId } });
    }

    // 已退役（重复提交/同时办理）：返回既有的唯一一份结果，不再生成记录、不改状态
    if (vehicle.status === VehicleStatus.Retired) {
      const existing = this.rows.find((item) => item.vehicleId === vehicle.id);
      if (existing) { return existing; }
    }

    const activeDispatchOrders = this.dispatchService.findActiveByVehicleId(vehicle.id)
      .map((item: any) => ({ id: item.id, orderNo: item.orderNo, status: item.status }));
    const activeMaintenanceRecords = this.maintenanceService.findActiveByVehicleId(vehicle.id)
      .map((item: any) => ({ id: item.id, item: item.item, status: item.status }));

    if (activeDispatchOrders.length > 0 || activeMaintenanceRecords.length > 0) {
      const occupation: RetirementOccupation = {
        dispatchOrders: activeDispatchOrders,
        maintenanceRecords: activeMaintenanceRecords,
      };
      // 注意：此处不写退役记录、不改车辆状态
      throw new ConflictException({ message: '车辆存在未完结的调度或维保，无法退役', data: occupation });
    }

    // 并发/重复办理兜底：已有记录则直接返回，只留一份结果
    const existing = this.rows.find((item) => item.vehicleId === vehicle.id);
    if (existing) { return existing; }

    const record: RetirementRecord = {
      id: this.rows.length + 1,
      vehicleId: vehicle.id,
      effectiveDate,
      reason,
      status: VehicleStatus.Retired,
      createdAt: new Date().toISOString(),
    };
    this.rows.push(record);
    // 核验通过后才改车辆状态，车辆随之从可选车队移除
    this.vehicleService.updateStatus(vehicle.id, VehicleStatus.Retired);
    return record;
  }
}
