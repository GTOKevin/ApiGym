import { Module } from '@nestjs/common';
import { RoutinesService } from './application/services/routines.service';
import { RoutinesController } from './presentation/controllers/routines.controller';
import { PrismaRoutineRepository } from './infrastructure/repositories/prisma-routine.repository';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RoutinesController],
  providers: [
    RoutinesService,
    {
      provide: 'IRoutineRepository',
      useClass: PrismaRoutineRepository,
    },
  ],
  exports: [RoutinesService],
})
export class RoutinesModule {}
