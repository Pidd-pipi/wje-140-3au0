import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { VehicleService } from '../services/vehicle.service';
@Controller('vehicles')
export class VehicleController {
  constructor(private readonly service: VehicleService) {}
  @Get() findAll() { return this.service.findAll(); }
  /** 可选车队：退役车辆不在其中；须在 :id 之前注册以免被吞 */
  @Get('available/list') findAvailable() { return this.service.findAvailable(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(Number(id)); }
  @Post() create(@Body() payload: any) { return this.service.create(payload); }
}
