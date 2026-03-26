import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import type { IDietRepository, CreateDietData } from '../../domain/interfaces/diet.repository.interface';
import { Diet } from '../../domain/entities/diet.entity';
import { MealType } from '@prisma/client';

@Injectable()
export class PrismaDietRepository implements IDietRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createWithMeals(data: CreateDietData): Promise<Diet> {
    const diet = await this.prisma.diet.create({
      data: {
        trainerId: data.trainerId,
        clientId: data.clientId,
        startDate: data.startDate,
        endDate: data.endDate,
        notes: data.notes,
        meals: {
          create: data.meals.map(meal => ({
            mealType: meal.mealType as MealType,
            description: meal.description,
            calories: meal.calories,
          })),
        },
      },
      include: {
        meals: true,
      },
    });

    return this.mapToEntity(diet);
  }

  async findByClient(clientId: string): Promise<Diet[]> {
    const diets = await this.prisma.diet.findMany({
      where: { clientId },
      include: { meals: true },
      orderBy: { startDate: 'desc' },
    });
    return diets.map(this.mapToEntity);
  }

  async findActiveByClient(clientId: string): Promise<Diet | null> {
    const today = new Date();
    const diet = await this.prisma.diet.findFirst({
      where: {
        clientId,
        isActive: true,
        startDate: { lte: today },
        endDate: { gte: today },
      },
      include: { meals: true },
      orderBy: { startDate: 'desc' },
    });
    return diet ? this.mapToEntity(diet) : null;
  }

  async findById(id: string): Promise<Diet | null> {
    const diet = await this.prisma.diet.findUnique({
      where: { id },
      include: { meals: true },
    });
    return diet ? this.mapToEntity(diet) : null;
  }

  private mapToEntity(prismaDiet: any): Diet {
    return {
      id: prismaDiet.id,
      trainerId: prismaDiet.trainerId,
      clientId: prismaDiet.clientId,
      startDate: prismaDiet.startDate,
      endDate: prismaDiet.endDate,
      notes: prismaDiet.notes,
      isActive: prismaDiet.isActive,
      createdAt: prismaDiet.createdAt,
      updatedAt: prismaDiet.updatedAt,
      meals: prismaDiet.meals?.map((m: any) => ({
        id: m.id,
        dietId: m.dietId,
        mealType: m.mealType,
        description: m.description,
        calories: m.calories,
      })),
    };
  }
}
