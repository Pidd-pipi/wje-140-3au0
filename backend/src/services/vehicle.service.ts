import { Injectable } from '@nestjs/common';
import { VehicleStatus } from '../types/enums';
@Injectable()
export class VehicleService {
  private rows = [
    { id: 1, plateNo: '沪A-7821', vehicleType: 'Refrigerated', brandModel: '东风天锦 KR', purchaseDate: '2023-03-12', insuranceExpireDate: '2026-09-30', inspectionExpireDate: '2026-11-20', status: 'Available', mileage: 88210, tankCapacity: 380, dailyFixedCost: 260 },
    { id: 2, plateNo: '沪B-3056', vehicleType: 'LightTruck', brandModel: '江铃顺达', purchaseDate: '2021-06-18', insuranceExpireDate: '2026-05-31', inspectionExpireDate: '2026-06-30', status: 'Available', mileage: 196400, tankCapacity: 120, dailyFixedCost: 140 }
  ];
  findAll() { return this.rows; }
  findSelectable() { return this.rows.filter((item: any) => item.status !== VehicleStatus.Retired); }
  findOne(id: number) { return this.rows.find((item: any) => item.id === id); }
  create(payload: any) { const row = { ...payload, id: this.rows.length + 1 }; this.rows.push(row); return row; }
  updateStatus(id: number, status: VehicleStatus) { const row: any = this.findOne(id); if (row) { row.status = status; } return row; }
}
