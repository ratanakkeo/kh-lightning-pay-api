import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateEscrowDto {
  @IsNotEmpty()
  @IsString()
  buyerId: string;

  @IsNotEmpty()
  @IsString()
  sellerId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsString()
  description?: string;
} 