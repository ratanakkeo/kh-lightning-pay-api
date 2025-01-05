import { ApiProperty } from '@nestjs/swagger';

export class LightningPaymentDto {
  @ApiProperty()
  paymentHash: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  status: 'pending' | 'locked' | 'completed' | 'refunded';

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
} 