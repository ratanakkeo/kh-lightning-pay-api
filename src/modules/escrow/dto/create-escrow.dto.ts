import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEscrowDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  sellerId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;
} 