import { Exercise } from '../entities/exercise.entity';

export interface IExerciseRepository {
  create(data: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>): Promise<Exercise>;
  findById(id: string): Promise<Exercise | null>;
  findAll(): Promise<Exercise[]>;
  update(id: string, data: Partial<Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Exercise>;
  delete(id: string): Promise<void>;
}
