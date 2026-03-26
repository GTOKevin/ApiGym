export class RoutineExercise {
  id: string;
  routineId: string;
  exerciseId: string;
  sets: number;
  reps: number;
  weightKg: number;
  restSeconds: number;
  orderIndex: number;
  isCompleted: boolean;
}

export class Routine {
  id: string;
  trainerId: string;
  clientId: string;
  date: Date | null;
  dayOfWeek: string | null;
  isTemplate: boolean;
  status: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  exercises?: RoutineExercise[];
}
