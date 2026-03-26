import { Decimal } from '@prisma/client/runtime/client';
import { SubscriptionPlan } from '../entities/subscription-plan.entity';

export interface ISubscriptionPlanRepository {
  findAllActive(): Promise<SubscriptionPlan[]>;
  findById(id: string): Promise<SubscriptionPlan | null>;
  create(data: { name: string; description: string; durationDays: number; price: Decimal }): Promise<SubscriptionPlan>;
  update(id: string, data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan>;
}
