import { Module } from '@nestjs/common';
import { ReportsService } from './application/services/reports.service';
import { ReportsController } from './presentation/controllers/reports.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
