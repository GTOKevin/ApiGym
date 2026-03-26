import { Module } from '@nestjs/common';
import { PaymentsService } from './application/services/payments.service';
import { PaymentsController } from './presentation/controllers/payments.controller';
import { PrismaPaymentRepository } from './infrastructure/repositories/prisma-payment.repository';

@Module({
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    {
      provide: 'IPaymentRepository',
      useClass: PrismaPaymentRepository,
    },
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
