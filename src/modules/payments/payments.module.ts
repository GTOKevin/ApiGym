import { Module } from '@nestjs/common';
import { PaymentsService } from './application/services/payments.service';
import { PaymentsController } from './presentation/controllers/payments.controller';
import { PrismaPaymentRepository } from './infrastructure/repositories/prisma-payment.repository';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { StripePaymentStrategy } from './application/strategies/stripe-payment.strategy';
import { MercadoPagoPaymentStrategy } from './application/strategies/mercadopago-payment.strategy';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    StripePaymentStrategy,
    MercadoPagoPaymentStrategy,
    {
      provide: 'IPaymentRepository',
      useClass: PrismaPaymentRepository,
    },
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
