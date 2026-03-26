import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/client';

export class Payment {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly amount: Decimal,
    public readonly currency: string,
    public readonly paymentMethod: PaymentMethod,
    public readonly status: PaymentStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly registeredById?: string | null,
    public readonly referenceId?: string | null,
  ) {}
}
