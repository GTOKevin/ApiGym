import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
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
    private readonly configService: ConfigService,
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

  async getMyPayments(userId: string, page: number = 1, limit: number = 10, status?: PaymentStatus) {
    const skip = (page - 1) * limit;
    return this.paymentRepository.findByUserId(userId, skip, limit, status);
  }

  async getAllPayments(page: number = 1, limit: number = 10, status?: PaymentStatus, paymentMethod?: PaymentMethod) {
    const skip = (page - 1) * limit;
    return this.paymentRepository.findAll(skip, limit, status, paymentMethod);
  }

  async processWebhookEvent(body: any, headers: any): Promise<void> {
    // 1. Determinar el proveedor (Culqi o MercadoPago) a partir de headers o body
    const isMercadoPago = headers['x-signature'] !== undefined || body.action !== undefined; // Lógica simplificada
    const isCulqi = body.object === 'event' || headers['x-culqi-signature'] !== undefined;

    // 2. Validar firma criptográfica (Simulado)
    const isValidSignature = this.validateWebhookSignature(body, headers, isMercadoPago ? 'mercadopago' : 'culqi');
    if (!isValidSignature) {
      throw new Error('Invalid webhook signature');
    }

    // 3. Procesar el evento según el proveedor
    if (isMercadoPago && body.action === 'payment.created') {
      const paymentId = body.data.id;
      // Lógica para actualizar estado del pago usando este ID externo
      console.log(`[Webhook] MercadoPago payment created: ${paymentId}`);
      // await this.paymentRepository.updateStatusByReference(paymentId, PaymentStatus.COMPLETED);
    } else if (isCulqi && body.type === 'charge.creation.succeeded') {
      const chargeId = body.data.id;
      // Lógica para actualizar estado del pago
      console.log(`[Webhook] Culqi charge succeeded: ${chargeId}`);
      // await this.paymentRepository.updateStatusByReference(chargeId, PaymentStatus.COMPLETED);
    }
  }

  private validateWebhookSignature(body: any, headers: any, gateway: 'mercadopago' | 'culqi'): boolean {
    try {
      const payload = JSON.stringify(body);
      
      if (gateway === 'mercadopago') {
        const secret = this.configService.get<string>('MERCADOPAGO_WEBHOOK_SECRET');
        if (!secret) return false;
        
        const signatureHeader = headers['x-signature'];
        if (!signatureHeader) return false;

        const parts = signatureHeader.split(',');
        let ts = '';
        let v1 = '';
        
        parts.forEach((part: string) => {
          const [key, value] = part.split('=');
          if (key === 'ts') ts = value;
          if (key === 'v1') v1 = value;
        });

        const manifest = `id:${body.data?.id};request-id:${headers['x-request-id']};ts:${ts};`;
        const hmac = crypto.createHmac('sha256', secret);
        const digest = hmac.update(manifest).digest('hex');
        
        return digest === v1;
      } 
      
      if (gateway === 'culqi') {
        const secret = this.configService.get<string>('CULQI_WEBHOOK_SECRET');
        if (!secret) return false;

        const signatureHeader = headers['x-culqi-signature'];
        if (!signatureHeader) return false;

        const hmac = crypto.createHmac('sha256', secret);
        const digest = hmac.update(payload).digest('hex');

        return digest === signatureHeader;
      }

      return false;
    } catch (error) {
      console.error('Error validando firma del webhook:', error);
      return false;
    }
  }
}
