import { Diet } from '../entities/diet.entity';

export interface CreateDietData {
  trainerId: string;
  clientId: string;
  startDate: Date;
  endDate: Date;
  notes?: string;
  meals: {
    mealType: string;
    description: string;
    calories?: number;
  }[];
}

export interface IDietRepository {
  createWithMeals(data: CreateDietData): Promise<Diet>;
  findByClient(clientId: string): Promise<Diet[]>;
  findActiveByClient(clientId: string): Promise<Diet | null>;
  findById(id: string): Promise<Diet | null>;
}
