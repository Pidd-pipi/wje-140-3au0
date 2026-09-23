import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { VehicleRetirementService } from '../services/vehicleRetirement.service';
@Controller('vehicle-retirements')
export class VehicleRetirementController {
  constructor(private readonly service: VehicleRetirementService) {}
  @Get() findAll(@Query('vehicleId') vehicleId?: string) { return this.service.findAll(vehicleId === undefined ? undefined : Number(vehicleId)); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(Number(id)); }
  // 退役办理为幂等动作：新建与命中既有记录均返回 200 与唯一记录
  @Post() @HttpCode(200) retire(@Body() payload: any) { return this.service.retire(payload); }
}
