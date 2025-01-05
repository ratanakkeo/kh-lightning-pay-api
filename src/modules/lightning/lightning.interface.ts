export interface ILightningService {
  generateInvoice(amount: number): Promise<string>;
  lockPayment(paymentHash: string): Promise<boolean>;
  releasePayment(paymentHash: string): Promise<boolean>;
  refundPayment(paymentHash: string): Promise<boolean>;
} 