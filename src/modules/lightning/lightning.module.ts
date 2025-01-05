import { Module } from '@nestjs/common';
import { LightningService } from './lightning.service';

@Module({
  providers: [LightningService],
  exports: [LightningService]
})
export class LightningModule {} 