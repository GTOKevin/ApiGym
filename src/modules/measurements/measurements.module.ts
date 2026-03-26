import { Module } from '@nestjs/common';
import { MeasurementsService } from './application/services/measurements.service';
import { MeasurementsController } from './presentation/controllers/measurements.controller';
import { PrismaMeasurementRepository } from './infrastructure/repositories/prisma-measurement.repository';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MeasurementsController],
  providers: [
    MeasurementsService,
    {
      provide: 'IMeasurementRepository',
      useClass: PrismaMeasurementRepository,
    },
  ],
  exports: [MeasurementsService],
})
export class MeasurementsModule {}
