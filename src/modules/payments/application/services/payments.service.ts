import { Injectable, Inject } from '@nestjs/common';
import type { IPaymentRepository } from '../../domain/interfaces/payment.repository.interface';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/client';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject('IPaymentRepository')
    private readonly paymentRepository: IPaymentRepository,
  ) {}

  async registerManualPayment(
    userId: string,
    registeredById: string,
    amount: number,
    paymentMethod: PaymentMethod,
  ): Promise<Payment> {
    // Aquí en un futuro se puede integrar lógica para activar suscripciones al pagar
    return this.paymentRepository.createManualPayment({
      userId,
      registeredById,
      amount: new Decimal(amount),
      currency: 'USD',
      paymentMethod,
      status: PaymentStatus.COMPLETED, // Pagos manuales asumen completados al instante
    });
  }

  async getMyPayments(userId: string): Promise<Payment[]> {
    return this.paymentRepository.findByUserId(userId);
  }
}
