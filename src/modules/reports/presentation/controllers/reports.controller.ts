import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReportsService } from '../../application/services/reports.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Roles(Role.ADMIN)
  @Get('dashboard')
  getDashboardStats() {
    return this.reportsService.getDashboardStats();
  }
}
