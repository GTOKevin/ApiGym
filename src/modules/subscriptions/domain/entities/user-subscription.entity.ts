import { SubscriptionStatus } from '@prisma/client';

export class UserSubscription {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly planId: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly status: SubscriptionStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
