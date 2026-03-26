import { UserSubscription } from '../entities/user-subscription.entity';
import { SubscriptionStatus } from '@prisma/client';

export interface IUserSubscriptionRepository {
  findActiveByUserId(userId: string): Promise<UserSubscription | null>;
  create(data: { userId: string; planId: string; startDate: Date; endDate: Date; status: SubscriptionStatus }): Promise<UserSubscription>;
}
