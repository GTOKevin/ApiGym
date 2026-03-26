import { Injectable, Inject } from '@nestjs/common';
import type { IPaymentRepository } from '../../domain/interfaces/payment.repository.interface';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/client';
import { StripePaymentStrategy } from '../strategies/stripe-payment.strategy';
import { MercadoPagoPaymentStrategy } from '../strategies/mercadopago-payment.strategy';
import { IPaymentStrategy } from '../strategies/payment.strategy.interface';
import { Payment } from '../../domain/entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject('IPaymentRepository')
    private readonly paymentRepository: IPaymentRepository,
    private readonly stripeStrategy: StripePaymentStrategy,
    private readonly mercadoPagoStrategy: MercadoPagoPaymentStrategy,
  ) {}

  async registerManualPayment(
    userId: string,
    registeredById: string,
    amount: number,
    paymentMethod: PaymentMethod,
  ): Promise<Payment> {
    return this.paymentRepository.createManualPayment({
      userId,
      registeredById,
      amount: new Decimal(amount),
      currency: 'USD',
      paymentMethod,
      status: PaymentStatus.COMPLETED,
    });
  }

  async processDigitalPayment(userId: string, amount: number, gateway: 'stripe' | 'mercadopago', paymentDetails: any) {
    let strategy: IPaymentStrategy;
    
    if (gateway === 'stripe') {
      strategy = this.stripeStrategy;
    } else if (gateway === 'mercadopago') {
      strategy = this.mercadoPagoStrategy;
    } else {
      throw new Error('Unsupported payment gateway');
    }

    const result = await strategy.processPayment(amount, 'USD', paymentDetails);

    if (result.success) {
      return this.paymentRepository.createManualPayment({
        userId,
        amount: new Decimal(amount),
        currency: 'USD',
        paymentMethod: PaymentMethod.APP_GATEWAY,
        status: PaymentStatus.COMPLETED,
        registeredById: userId, // Assuming the user registers their own payment digitally
      });
    }

    throw new Error('Payment failed');
  }

  async getMyPayments(userId: string): Promise<Payment[]> {
    return this.paymentRepository.findByUserId(userId);
  }
}
