import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { VehicleService } from '../services/vehicle.service';
@Controller('vehicles')
export class VehicleController {
  constructor(private readonly service: VehicleService) {}
  @Get() findAll(@Query('selectable') selectable?: string) { return selectable === 'true' ? this.service.findSelectable() : this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(Number(id)); }
  @Post() create(@Body() payload: any) { return this.service.create(payload); }
}
