import { Routine } from '../entities/routine.entity';

export interface CreateRoutineData {
  trainerId: string;
  clientId: string;
  date?: Date;
  dayOfWeek?: string;
  isTemplate?: boolean;
  notes?: string;
  exercises: {
    exerciseId: string;
    sets: number;
    reps: number;
    weightKg: number;
    restSeconds: number;
    orderIndex: number;
  }[];
}

export interface IRoutineRepository {
  createWithExercises(data: CreateRoutineData): Promise<Routine>;
  findById(id: string): Promise<Routine | null>;
  findTodayByClient(clientId: string): Promise<Routine[]>;
  findByClient(clientId: string): Promise<Routine[]>;
  markExerciseCompleted(routineExerciseId: string, isCompleted: boolean): Promise<void>;
}
