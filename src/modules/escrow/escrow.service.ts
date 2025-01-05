import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Escrow, EscrowStatus } from './entities/escrow.entity';
import { CreateEscrowDto } from './dto/create-escrow.dto';
import { LightningService } from '../lightning/lightning.service';
import { EscrowRepository } from './escrow.repository';

@Injectable()
export class EscrowService {
  constructor(
    @InjectRepository(Escrow)
    private escrowRepository: EscrowRepository,
    private lightningService: LightningService
  ) {}

  async findAll(): Promise<Escrow[]> {
    return this.escrowRepository.find();
  }

  async findOne(id: string): Promise<Escrow> {
    const escrow = await this.escrowRepository.findOne({ where: { id } });
    if (!escrow) {
      throw new NotFoundException('Escrow not found');
    }
    return escrow;
  }

  async findByBuyer(buyerId: string): Promise<Escrow[]> {
    return this.escrowRepository.findByBuyerId(buyerId);
  }

  async findBySeller(sellerId: string): Promise<Escrow[]> {
    return this.escrowRepository.findBySellerId(sellerId);
  }

  async createEscrow(buyerId: string, createEscrowDto: CreateEscrowDto): Promise<Escrow> {
    const paymentHash = await this.lightningService.generateInvoice(createEscrowDto.amount);
    
    const escrow = this.escrowRepository.create({
      buyerId,
      sellerId: createEscrowDto.sellerId,
      amount: createEscrowDto.amount,
      lightningPaymentHash: paymentHash,
      status: EscrowStatus.INITIATED
    });

    return this.escrowRepository.save(escrow);
  }

  async confirmPayment(escrowId: string, userId: string): Promise<Escrow> {
    const escrow = await this.findOne(escrowId);
    
    if (escrow.buyerId !== userId) {
      throw new ForbiddenException('Only buyer can confirm payment');
    }

    if (escrow.status !== EscrowStatus.INITIATED) {
      throw new BadRequestException('Invalid escrow status for payment confirmation');
    }

    const isLocked = await this.lightningService.lockPayment(escrow.lightningPaymentHash);
    if (!isLocked) {
      throw new BadRequestException('Payment could not be locked');
    }

    escrow.status = EscrowStatus.PAYMENT_LOCKED;
    return this.escrowRepository.save(escrow);
  }

  async confirmShipment(escrowId: string, userId: string): Promise<Escrow> {
    const escrow = await this.findOne(escrowId);
    
    if (escrow.sellerId !== userId) {
      throw new ForbiddenException('Only seller can confirm shipment');
    }

    if (escrow.status !== EscrowStatus.PAYMENT_LOCKED) {
      throw new BadRequestException('Invalid escrow status for shipment confirmation');
    }
    
    escrow.status = EscrowStatus.SHIPMENT_CONFIRMED;
    return this.escrowRepository.save(escrow);
  }

  async confirmReceipt(escrowId: string, userId: string): Promise<Escrow> {
    const escrow = await this.findOne(escrowId);
    
    if (escrow.buyerId !== userId) {
      throw new ForbiddenException('Only buyer can confirm receipt');
    }

    if (escrow.status !== EscrowStatus.SHIPMENT_CONFIRMED) {
      throw new BadRequestException('Invalid escrow status for receipt confirmation');
    }

    await this.lightningService.releasePayment(escrow.lightningPaymentHash);
    escrow.status = EscrowStatus.COMPLETED;
    return this.escrowRepository.save(escrow);
  }

  async initiateDispute(escrowId: string, userId: string): Promise<Escrow> {
    const escrow = await this.findOne(escrowId);
    
    if (escrow.buyerId !== userId && escrow.sellerId !== userId) {
      throw new ForbiddenException('Only buyer or seller can initiate dispute');
    }

    if (escrow.status === EscrowStatus.COMPLETED || escrow.status === EscrowStatus.REFUNDED) {
      throw new BadRequestException('Cannot dispute completed or refunded escrow');
    }

    escrow.status = EscrowStatus.DISPUTED;
    return this.escrowRepository.save(escrow);
  }

  async refund(escrowId: string): Promise<Escrow> {
    const escrow = await this.findOne(escrowId);
    
    if (escrow.status !== EscrowStatus.DISPUTED) {
      throw new BadRequestException('Only disputed escrows can be refunded');
    }

    await this.lightningService.refundPayment(escrow.lightningPaymentHash);
    escrow.status = EscrowStatus.REFUNDED;
    return this.escrowRepository.save(escrow);
  }
} 