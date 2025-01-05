import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEscrowDto } from './dto/create-escrow.dto';
import { EscrowStatus } from '../../common/enums/escrow.enum';
import { LightningService } from '../lightning/lightning.service';
import { NotificationService } from '../notification/notification.service';
import { Escrow } from './entities/escrow.entity';
import { NotificationType } from '../../common/enums/notification.type.enum';
@Injectable()
export class EscrowService {
  constructor(
    @InjectRepository(Escrow)
    private escrowRepository: Repository<Escrow>,
    private lightningService: LightningService,
    private notificationService: NotificationService
  ) {}

  async createEscrow(createEscrowDto: CreateEscrowDto) {
    const escrow = this.escrowRepository.create({
      ...createEscrowDto,
      status: EscrowStatus.PAYMENT_PENDING,
    });
    return await this.escrowRepository.save(escrow);
  }

  async lockPayment(id: string) {
    const escrow = await this.findEscrow(id);
    
    const success = await this.lightningService.holdPayment({
      amount: escrow.amount,
      description: escrow.description,
    });

    if (!success) {
      throw new BadRequestException('Failed to lock payment');
    }

    escrow.status = EscrowStatus.PAYMENT_LOCKED;
    await this.escrowRepository.save(escrow);

    // Notify seller about the sale
    await this.notificationService.sendNotification(
      escrow.sellerId,
      NotificationType.SALE_NOTIFICATION,
      { escrowId: id, amount: escrow.amount }
    );
    
    return escrow;
  }

  async confirmShipment(id: string) {
    const escrow = await this.findEscrow(id);
    
    if (escrow.status !== EscrowStatus.PAYMENT_LOCKED) {
      throw new BadRequestException('Payment must be locked first');
    }

    escrow.status = EscrowStatus.SHIPMENT_CONFIRMED;
    await this.escrowRepository.save(escrow);

    // Notify buyer about shipment
    await this.notificationService.sendNotification(
      escrow.buyerId,
      NotificationType.SHIPMENT_NOTIFICATION,
      { escrowId: id }
    );

    return escrow;
  }

  async confirmReceipt(id: string) {
    const escrow = await this.findEscrow(id);
    
    if (escrow.status !== EscrowStatus.SHIPMENT_CONFIRMED) {
      throw new BadRequestException('Shipment must be confirmed first');
    }

    const success = await this.lightningService.releasePayment({
      escrowId: id,
      recipientId: escrow.sellerId,
    });

    if (!success) {
      throw new BadRequestException('Failed to release payment');
    }

    escrow.status = EscrowStatus.COMPLETED;
    return await this.escrowRepository.save(escrow);
  }

  async createDispute(id: string, reason: string) {
    const escrow = await this.findEscrow(id);
    
    if (escrow.status === EscrowStatus.COMPLETED) {
      throw new BadRequestException('Cannot dispute completed transaction');
    }

    escrow.status = EscrowStatus.DISPUTED;
    escrow.disputeReason = reason;
    await this.escrowRepository.save(escrow);

    // Notify both parties about the dispute
    await Promise.all([
      this.notificationService.sendNotification(
        escrow.buyerId,
        NotificationType.DISPUTE_NOTIFICATION,
        { escrowId: id, reason }
      ),
      this.notificationService.sendNotification(
        escrow.sellerId,
        NotificationType.DISPUTE_NOTIFICATION,
        { escrowId: id, reason }
      )
    ]);

    await this.startMediation(id);
    return escrow;
  }

  private async findEscrow(id: string): Promise<Escrow> {
    const escrow = await this.escrowRepository.findOne({ where: { id } });
    if (!escrow) {
      throw new NotFoundException('Escrow not found');
    }
    return escrow;
  }

  private async startMediation(escrowId: string) {
    // TODO: Implement mediation process
    console.log('Starting mediation for escrow:', escrowId);
  }
} 