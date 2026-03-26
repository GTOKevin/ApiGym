export interface IPaymentStrategy {
  processPayment(amount: number, currency: string, paymentDetails: any): Promise<{ success: boolean; transactionId: string }>;
}
