import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/prisma/prisma.service';
import { ISubscriptionPlanRepository } from '../../domain/interfaces/subscription-plan.repository.interface';
import { SubscriptionPlan } from '../../domain/entities/subscription-plan.entity';
import { Decimal } from '@prisma/client/runtime/client';

@Injectable()
export class PrismaSubscriptionPlanRepository implements ISubscriptionPlanRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllActive(): Promise<SubscriptionPlan[]> {
    const plans = await this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
    });
    return plans.map(this.mapToDomain);
  }

  async findById(id: string): Promise<SubscriptionPlan | null> {
    const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id } });
    if (!plan) return null;
    return this.mapToDomain(plan);
  }

  async create(data: { name: string; description: string; durationDays: number; price: Decimal }): Promise<SubscriptionPlan> {
    const plan = await this.prisma.subscriptionPlan.create({ data });
    return this.mapToDomain(plan);
  }

  async update(id: string, data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    const plan = await this.prisma.subscriptionPlan.update({
      where: { id },
      data,
    });
    return this.mapToDomain(plan);
  }

  private mapToDomain(plan: any): SubscriptionPlan {
    return new SubscriptionPlan(
      plan.id,
      plan.name,
      plan.description,
      plan.durationDays,
      plan.price,
      plan.isActive,
      plan.createdAt,
      plan.updatedAt,
    );
  }
}
