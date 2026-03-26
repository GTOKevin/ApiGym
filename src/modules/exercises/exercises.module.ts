import { Module } from '@nestjs/common';
import { ExercisesService } from './application/services/exercises.service';
import { ExercisesController } from './presentation/controllers/exercises.controller';
import { PrismaExerciseRepository } from './infrastructure/repositories/prisma-exercise.repository';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ExercisesController],
  providers: [
    ExercisesService,
    {
      provide: 'IExerciseRepository',
      useClass: PrismaExerciseRepository,
    },
  ],
  exports: [ExercisesService],
})
export class ExercisesModule {}
