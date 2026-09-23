import { Injectable } from '@nestjs/common';
import { MaintenanceStatus } from '../types/enums';
@Injectable()
export class MaintenanceService {
  private rows = [{ id: 1, vehicleId: 1, maintenanceType: 'Routine', item: '机油与制动检查', cost: 2100, vendor: '青浦维保站', date: '2026-06-06', nextMileage: 93000, nextDate: '2026-09-06', status: 'Completed' }];
  findAll() { return this.rows; }
  findOne(id: number) { return this.rows.find((item: any) => item.id === id); }
  /** 按车查询全部维保记录（含已完成的历史，退役后仍可查） */
  findByVehicleId(vehicleId: number) { return this.rows.filter((item: any) => item.vehicleId === vehicleId); }
  /** 占用车辆的未完结维保：待开始或进行中 */
  findActiveByVehicleId(vehicleId: number) {
    return this.rows.filter((item: any) => item.vehicleId === vehicleId
      && (item.status === MaintenanceStatus.Scheduled || item.status === MaintenanceStatus.InProgress));
  }
  create(payload: any) { const row = { ...payload, id: this.rows.length + 1 }; this.rows.push(row); return row; }
}
