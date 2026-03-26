export class DietMeal {
  id: string;
  dietId: string;
  mealType: string;
  description: string;
  calories: number | null;
}

export class Diet {
  id: string;
  trainerId: string;
  clientId: string;
  startDate: Date;
  endDate: Date;
  notes: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  meals?: DietMeal[];
}
