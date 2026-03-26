import { Module } from '@nestjs/common';
import { SubscriptionPlansService } from './application/services/subscription-plans.service';
import { SubscriptionPlansController } from './presentation/controllers/subscription-plans.controller';
import { PrismaSubscriptionPlanRepository } from './infrastructure/repositories/prisma-subscription-plan.repository';

@Module({
  controllers: [SubscriptionPlansController],
  providers: [
    SubscriptionPlansService,
    {
      provide: 'ISubscriptionPlanRepository',
      useClass: PrismaSubscriptionPlanRepository,
    },
  ],
  exports: [SubscriptionPlansService],
})
export class SubscriptionsModule {}
