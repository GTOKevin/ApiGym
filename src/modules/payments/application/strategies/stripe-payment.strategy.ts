import { Injectable } from '@nestjs/common';
import { IPaymentStrategy } from './payment.strategy.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StripePaymentStrategy implements IPaymentStrategy {
  async processPayment(amount: number, currency: string, paymentDetails: any): Promise<{ success: boolean; transactionId: string }> {
    // Aquí iría la integración real con el SDK de Stripe
    // const charge = await stripe.charges.create({...})
    
    // Simulación
    return {
      success: true,
      transactionId: `stripe_${uuidv4()}`,
    };
  }
}
