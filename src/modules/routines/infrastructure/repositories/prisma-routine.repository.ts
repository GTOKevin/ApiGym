import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import type { IRoutineRepository, CreateRoutineData } from '../../domain/interfaces/routine.repository.interface';
import { Routine } from '../../domain/entities/routine.entity';
import { DayOfWeek } from '@prisma/client';

@Injectable()
export class PrismaRoutineRepository implements IRoutineRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createWithExercises(data: CreateRoutineData): Promise<Routine> {
    const routine = await this.prisma.routine.create({
      data: {
        trainerId: data.trainerId,
        clientId: data.clientId,
        date: data.date,
        dayOfWeek: data.dayOfWeek as DayOfWeek,
        isTemplate: data.isTemplate,
        notes: data.notes,
        exercises: {
          create: data.exercises.map(ex => ({
            exerciseId: ex.exerciseId,
            sets: ex.sets,
            reps: ex.reps,
            weightKg: ex.weightKg,
            restSeconds: ex.restSeconds,
            orderIndex: ex.orderIndex,
          })),
        },
      },
      include: {
        exercises: true,
      },
    });

    return this.mapToEntity(routine);
  }

  async findById(id: string): Promise<Routine | null> {
    const routine = await this.prisma.routine.findUnique({
      where: { id },
      include: { exercises: true },
    });
    return routine ? this.mapToEntity(routine) : null;
  }

  async findTodayByClient(clientId: string): Promise<Routine[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const routines = await this.prisma.routine.findMany({
      where: {
        clientId,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        exercises: {
          include: { exercise: true },
        },
      },
    });
    return routines.map(this.mapToEntity);
  }

  async findByClient(clientId: string): Promise<Routine[]> {
    const routines = await this.prisma.routine.findMany({
      where: { clientId },
      include: {
        exercises: {
          include: { exercise: true },
        },
      },
      orderBy: { date: 'desc' },
    });
    return routines.map(this.mapToEntity);
  }

  async markExerciseCompleted(routineExerciseId: string, isCompleted: boolean): Promise<void> {
    await this.prisma.routineExercise.update({
      where: { id: routineExerciseId },
      data: { isCompleted },
    });
  }

  private mapToEntity(prismaRoutine: any): Routine {
    return {
      id: prismaRoutine.id,
      trainerId: prismaRoutine.trainerId,
      clientId: prismaRoutine.clientId,
      date: prismaRoutine.date,
      dayOfWeek: prismaRoutine.dayOfWeek,
      isTemplate: prismaRoutine.isTemplate,
      status: prismaRoutine.status,
      notes: prismaRoutine.notes,
      createdAt: prismaRoutine.createdAt,
      updatedAt: prismaRoutine.updatedAt,
      exercises: prismaRoutine.exercises?.map((ex: any) => ({
        id: ex.id,
        routineId: ex.routineId,
        exerciseId: ex.exerciseId,
        sets: ex.sets,
        reps: ex.reps,
        weightKg: Number(ex.weightKg),
        restSeconds: ex.restSeconds,
        orderIndex: ex.orderIndex,
        isCompleted: ex.isCompleted,
      })),
    };
  }
}
