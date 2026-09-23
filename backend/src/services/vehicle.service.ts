import { Injectable } from '@nestjs/common';
import { VehicleStatus } from '../types/enums';
@Injectable()
export class VehicleService {
  private rows = [{ id: 1, plateNo: '沪A-7821', vehicleType: 'Refrigerated', brandModel: '东风天锦 KR', purchaseDate: '2023-03-12', insuranceExpireDate: '2026-09-30', inspectionExpireDate: '2026-11-20', status: 'Available', mileage: 88210, tankCapacity: 380, dailyFixedCost: 260 }];
  findAll() { return this.rows; }
  /** 可选车队：不含已退役车辆 */
  findAvailable() { return this.rows.filter((item: any) => item.status !== VehicleStatus.Retired); }
  findOne(id: number) { return this.rows.find((item: any) => item.id === id); }
  /** 仅更新车辆状态字段 */
  updateStatus(id: number, status: VehicleStatus) {
    const row = this.rows.find((item: any) => item.id === id);
    if (row) { row.status = status; }
    return row;
  }
  create(payload: any) { const row = { ...payload, id: this.rows.length + 1 }; this.rows.push(row); return row; }
}
