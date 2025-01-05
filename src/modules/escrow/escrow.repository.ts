import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Escrow } from './entities/escrow.entity';

@Injectable()
export class EscrowRepository extends Repository<Escrow> {
  constructor(private dataSource: DataSource) {
    super(Escrow, dataSource.createEntityManager());
  }

  async findByBuyerId(buyerId: string): Promise<Escrow[]> {
    return this.find({ where: { buyerId } });
  }

  async findBySellerId(sellerId: string): Promise<Escrow[]> {
    return this.find({ where: { sellerId } });
  }
} 