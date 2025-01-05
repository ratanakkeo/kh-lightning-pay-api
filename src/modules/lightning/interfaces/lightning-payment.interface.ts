export interface LightningPayment {
  paymentHash: string;
  amount: number;
  status: 'pending' | 'locked' | 'completed' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
} 