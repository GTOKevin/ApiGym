export class Measurement {
  id: string;
  userId: string;
  trainerId: string;
  date: Date;
  weightKg: number;
  bodyFatPct: number | null;
  muscleMassKg: number | null;
  chestCm: number | null;
  armsCm: number | null;
  waistCm: number | null;
  legsCm: number | null;
  createdAt: Date;
}
