import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RetirementService } from '../services/retirement.service';
import { RetirementRequest } from '../types/interfaces';

@Controller('vehicle-retirements')
export class RetirementController {
  constructor(private readonly service: RetirementService) {}

  /** 全部退役记录 */
  @Get() findAll() { return this.service.findAll(); }

  /** 某辆车的退役记录（按车可查） */
  @Get('vehicle/:vehicleId')
  findByVehicleId(@Param('vehicleId') vehicleId: string) {
    return this.service.findByVehicleId(Number(vehicleId));
  }

  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(Number(id)); }

  /** 提交退役办理：车辆、生效日期、原因 */
  @Post() submit(@Body() payload: RetirementRequest) { return this.service.submit(payload); }
}
