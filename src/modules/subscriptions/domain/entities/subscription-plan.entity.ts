import { Decimal } from "@prisma/client/runtime/client";


export class SubscriptionPlan {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly durationDays: number,
    public readonly price: Decimal,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
