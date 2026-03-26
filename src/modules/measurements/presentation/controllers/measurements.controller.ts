import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MeasurementsService } from '../../application/services/measurements.service';
import { CreateMeasurementDto } from '../../application/dto/create-measurement.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('measurements')
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @Roles(Role.TRAINER, Role.ADMIN)
  @Post()
  create(@Request() req: any, @Body() createMeasurementDto: CreateMeasurementDto) {
    const trainerId = req.user.userId;
    return this.measurementsService.create(trainerId, createMeasurementDto);
  }

  @Roles(Role.USER, Role.TRAINER, Role.ADMIN)
  @Get('my-measurements')
  getMyMeasurements(@Request() req: any) {
    return this.measurementsService.findByUser(req.user.userId);
  }

  @Roles(Role.TRAINER, Role.ADMIN)
  @Get('user/:userId')
  getUserMeasurements(@Param('userId') userId: string) {
    return this.measurementsService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.measurementsService.findOne(id);
  }
}
