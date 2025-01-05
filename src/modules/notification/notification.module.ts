import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationService } from './notification.service';
import { SmsProvider } from './providers/sms.provider';
import { TelegramProvider } from './providers/telegram.provider';

@Module({
  imports: [ConfigModule],
  providers: [
    NotificationService,
    SmsProvider,
    TelegramProvider,
  ],
  exports: [NotificationService],
})
export class NotificationModule {} 