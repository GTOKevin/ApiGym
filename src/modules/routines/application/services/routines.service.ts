import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IRoutineRepository } from '../../domain/interfaces/routine.repository.interface';
import { CreateRoutineDto } from '../dto/create-routine.dto';

@Injectable()
export class RoutinesService {
  constructor(
    @Inject('IRoutineRepository')
    private readonly routineRepository: IRoutineRepository,
  ) {}

  async createRoutine(trainerId: string, dto: CreateRoutineDto) {
    return this.routineRepository.createWithExercises({
      trainerId,
      clientId: dto.clientId,
      date: dto.date ? new Date(dto.date) : undefined,
      dayOfWeek: dto.dayOfWeek,
      isTemplate: dto.isTemplate,
      notes: dto.notes,
      exercises: dto.exercises,
    });
  }

  async getClientRoutines(clientId: string) {
    return this.routineRepository.findByClient(clientId);
  }

  async getClientTodayRoutine(clientId: string) {
    return this.routineRepository.findTodayByClient(clientId);
  }

  async markExerciseCompleted(routineExerciseId: string, isCompleted: boolean) {
    await this.routineRepository.markExerciseCompleted(routineExerciseId, isCompleted);
    return { success: true };
  }
}
