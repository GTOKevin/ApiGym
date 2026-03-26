import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import type { IExerciseRepository } from '../../domain/interfaces/exercise.repository.interface';
import { Exercise } from '../../domain/entities/exercise.entity';

@Injectable()
export class PrismaExerciseRepository implements IExerciseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>): Promise<Exercise> {
    return this.prisma.exercise.create({
      data,
    });
  }

  async findById(id: string): Promise<Exercise | null> {
    return this.prisma.exercise.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<Exercise[]> {
    return this.prisma.exercise.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async update(id: string, data: Partial<Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Exercise> {
    return this.prisma.exercise.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.exercise.delete({
      where: { id },
    });
  }
}
