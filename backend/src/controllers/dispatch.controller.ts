import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DispatchService } from '../services/dispatch.service';
@Controller('dispatch-orders')
export class DispatchController {
  constructor(private readonly service: DispatchService) {}
  @Get() findAll(@Query('vehicleId') vehicleId?: string) { return this.service.findAll(vehicleId === undefined ? undefined : Number(vehicleId)); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(Number(id)); }
  @Post() create(@Body() payload: any) { return this.service.create(payload); }
}
