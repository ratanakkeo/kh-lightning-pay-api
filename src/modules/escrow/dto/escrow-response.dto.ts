import { ApiProperty } from '@nestjs/swagger';
import { EscrowStatus } from '../../../common/enums/escrow.enum';

export class EscrowResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  buyerId: string;

  @ApiProperty()
  sellerId: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  status: EscrowStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
} 