import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import type { IExerciseRepository } from '../../domain/interfaces/exercise.repository.interface';
import { Exercise } from '../../domain/entities/exercise.entity';
import { Prisma } from '@prisma/client';

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

  async findAll(skip?: number, take?: number, muscleGroup?: string, search?: string): Promise<{ data: Exercise[], total: number }> {
    const where: Prisma.ExerciseWhereInput = {};
    
    if (muscleGroup) {
      where.muscleGroup = muscleGroup;
    }
    
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.exercise.findMany({
        where,
        skip,
        take,
        orderBy: { name: 'asc' },
      }),
      this.prisma.exercise.count({ where }),
    ]);

    return { data, total };
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
