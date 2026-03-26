import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/prisma/prisma.service';
import type { IPaymentRepository } from '../../domain/interfaces/payment.repository.interface';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/client';

@Injectable()
export class PrismaPaymentRepository implements IPaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createManualPayment(data: {
    userId: string;
    registeredById: string;
    amount: Decimal;
    currency: string;
    paymentMethod: PaymentMethod;
    status: PaymentStatus;
  }): Promise<Payment> {
    const payment = await this.prisma.payment.create({
      data: {
        userId: data.userId,
        registeredById: data.registeredById,
        amount: data.amount,
        currency: data.currency,
        paymentMethod: data.paymentMethod,
        status: data.status,
      },
    });
    return this.mapToDomain(payment);
  }

  async findByUserId(userId: string, skip?: number, take?: number, status?: PaymentStatus): Promise<{ data: Payment[], total: number }> {
    const where: any = { userId };
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return { data: data.map(this.mapToDomain), total };
  }

  async findAll(skip?: number, take?: number, status?: PaymentStatus, paymentMethod?: PaymentMethod): Promise<{ data: Payment[], total: number }> {
    const where: any = {};
    if (status) where.status = status;
    if (paymentMethod) where.paymentMethod = paymentMethod;

    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return { data: data.map(this.mapToDomain), total };
  }

  private mapToDomain(record: any): Payment {
    return new Payment(
      record.id,
      record.userId,
      record.amount,
      record.currency,
      record.paymentMethod,
      record.status,
      record.createdAt,
      record.updatedAt,
      record.registeredById,
      record.referenceId,
    );
  }
}
