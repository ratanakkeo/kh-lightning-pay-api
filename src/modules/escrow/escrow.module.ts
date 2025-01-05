import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EscrowController } from './escrow.controller';
import { EscrowService } from './escrow.service';
import { Escrow } from './entities/escrow.entity';
import { LightningModule } from '../lightning/lightning.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Escrow]),
    LightningModule
  ],
  controllers: [EscrowController],
  providers: [EscrowService],
  exports: [EscrowService]
})
export class EscrowModule {} 