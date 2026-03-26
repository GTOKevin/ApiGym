import { Module } from '@nestjs/common';
import { AssignmentsService } from './application/services/assignments.service';
import { AssignmentsController } from './presentation/controllers/assignments.controller';
import { PrismaTrainerClientRepository } from './infrastructure/repositories/prisma-trainer-client.repository';

@Module({
  controllers: [AssignmentsController],
  providers: [
    AssignmentsService,
    {
      provide: 'ITrainerClientRepository',
      useClass: PrismaTrainerClientRepository,
    },
  ],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
