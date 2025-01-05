import { Controller, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { EscrowService } from './escrow.service';
import { CreateEscrowDto } from './dto/create-escrow.dto';
import { UpdateEscrowStatusDto } from './dto/update-escrow.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('escrow')
@UseGuards(AuthGuard('jwt'))
export class EscrowController {
  constructor(private readonly escrowService: EscrowService) {}

  @Post()
  async createEscrow(@Body() createEscrowDto: CreateEscrowDto) {
    return await this.escrowService.createEscrow(createEscrowDto);
  }

  @Post(':id/lock-payment')
  async lockPayment(@Param('id') id: string) {
    return await this.escrowService.lockPayment(id);
  }

  @Put(':id/confirm-shipment')
  async confirmShipment(@Param('id') id: string) {
    return await this.escrowService.confirmShipment(id);
  }

  @Put(':id/confirm-receipt')
  async confirmReceipt(@Param('id') id: string) {
    return await this.escrowService.confirmReceipt(id);
  }

  @Post(':id/dispute')
  async createDispute(
    @Param('id') id: string,
    @Body() disputeDetails: { reason: string }
  ) {
    return await this.escrowService.createDispute(id, disputeDetails.reason);
  }
} 