import { IsString, IsEnum } from 'class-validator';
import { EscrowStatus } from '../../../common/enums/escrow.enum';

export class UpdateEscrowStatusDto {
  @IsString()
  @IsEnum(EscrowStatus)
  status: EscrowStatus;
} 