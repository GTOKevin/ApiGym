import { Exercise } from '../entities/exercise.entity';

export interface IExerciseRepository {
  create(data: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>): Promise<Exercise>;
  findById(id: string): Promise<Exercise | null>;
  findAll(skip?: number, take?: number, muscleGroup?: string, search?: string): Promise<{ data: Exercise[], total: number }>;
  update(id: string, data: Partial<Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Exercise>;
  delete(id: string): Promise<void>;
}
