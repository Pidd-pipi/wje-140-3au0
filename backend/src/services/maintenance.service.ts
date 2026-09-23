import { Injectable } from '@nestjs/common';
import { MaintenanceStatus } from '../types/enums';
@Injectable()
export class MaintenanceService {
  private rows = [
    { id: 1, vehicleId: 1, maintenanceType: 'Routine', item: '机油与制动检查', cost: 2100, vendor: '青浦维保站', date: '2026-06-06', nextMileage: 93000, nextDate: '2026-09-06', status: 'Completed' },
    { id: 2, vehicleId: 1, maintenanceType: 'Inspection', item: '年检预检', cost: 0, vendor: '青浦维保站', date: '2026-10-10', nextMileage: 95000, nextDate: '2026-12-10', status: 'Scheduled' }
  ];
  findAll(vehicleId?: number) { return vehicleId === undefined ? this.rows : this.rows.filter((item: any) => item.vehicleId === vehicleId); }
  findOne(id: number) { return this.rows.find((item: any) => item.id === id); }
  findActiveByVehicle(vehicleId: number) { return this.rows.filter((item: any) => item.vehicleId === vehicleId && (item.status === MaintenanceStatus.Scheduled || item.status === MaintenanceStatus.InProgress)); }
  create(payload: any) { const row = { ...payload, id: this.rows.length + 1 }; this.rows.push(row); return row; }
}
