import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum EscrowStatus {
  INITIATED = 'initiated',
  PAYMENT_LOCKED = 'payment_locked',
  SHIPMENT_CONFIRMED = 'shipment_confirmed',
  COMPLETED = 'completed',
  DISPUTED = 'disputed',
  REFUNDED = 'refunded'
}

@Entity('escrows')
export class Escrow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  buyerId: string;

  @Column()
  sellerId: string;

  @Column()
  amount: number;

  @Column()
  lightningPaymentHash: string;

  @Column({
    type: 'enum',
    enum: EscrowStatus,
    default: EscrowStatus.INITIATED
  })
  status: EscrowStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 