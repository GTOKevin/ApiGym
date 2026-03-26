import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ISubscriptionPlanRepository } from '../../domain/interfaces/subscription-plan.repository.interface';
import { SubscriptionPlan } from '../../domain/entities/subscription-plan.entity';
import { Decimal } from '@prisma/client/runtime/client';

@Injectable()
export class SubscriptionPlansService {
  constructor(
    @Inject('ISubscriptionPlanRepository')
    private readonly planRepository: ISubscriptionPlanRepository,
  ) {}


  async findAllActive(): Promise<SubscriptionPlan[]> {
    return this.planRepository.findAllActive();
  }

  async create(data: { name: string; description: string; durationDays: number; price: number }): Promise<SubscriptionPlan> {
    return this.planRepository.create({
      ...data,
      price: new Decimal(data.price),
    });
  }
}
