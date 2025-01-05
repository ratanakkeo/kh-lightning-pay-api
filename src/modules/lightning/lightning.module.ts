import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LightningService } from './lightning.service';

@Module({
  imports: [ConfigModule],
  providers: [LightningService],
  exports: [LightningService]
})
export class LightningModule {} 