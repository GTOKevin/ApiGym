import { Payment } from '../entities/payment.entity';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/client';

export interface IPaymentRepository {
  createManualPayment(data: {
    userId: string;
    registeredById: string;
    amount: Decimal;
    currency: string;
    paymentMethod: PaymentMethod;
    status: PaymentStatus;
  }): Promise<Payment>;
  
  findByUserId(userId: string, skip?: number, take?: number, status?: PaymentStatus): Promise<{ data: Payment[], total: number }>;
  findAll(skip?: number, take?: number, status?: PaymentStatus, paymentMethod?: PaymentMethod): Promise<{ data: Payment[], total: number }>;
}
