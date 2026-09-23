import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MaintenanceService } from '../services/maintenance.service';
@Controller('maintenance-records')
export class MaintenanceController {
  constructor(private readonly service: MaintenanceService) {}
  @Get() findAll() { return this.service.findAll(); }
  /** 按车查询维保历史（含已完成，车辆退役后仍可查）；须在 :id 之前注册 */
  @Get('vehicle/:vehicleId')
  findByVehicleId(@Param('vehicleId') vehicleId: string) { return this.service.findByVehicleId(Number(vehicleId)); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(Number(id)); }
  @Post() create(@Body() payload: any) { return this.service.create(payload); }
}
