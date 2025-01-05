import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { EscrowStatus } from '../../../common/enums/escrow.enum';

@Entity()
export class Escrow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  buyerId: string;

  @Column()
  sellerId: string;

  @Column('decimal')
  amount: number;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: EscrowStatus,
    default: EscrowStatus.PAYMENT_PENDING
  })
  status: EscrowStatus;

  @Column({ nullable: true })
  disputeReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 