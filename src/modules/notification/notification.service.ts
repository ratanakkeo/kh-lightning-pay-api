import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationChannel, NotificationPayload } from './interfaces/notification-channel.interface';
import { SmsProvider } from './providers/sms.provider';
import { TelegramProvider } from './providers/telegram.provider';
import { NotificationType } from '../../common/enums/notification.type.enum';
@Injectable()
export class NotificationService {
  private channels: NotificationChannel[];

  constructor(
    private configService: ConfigService,
    private smsProvider: SmsProvider,
    private telegramProvider: TelegramProvider,
  ) {
    this.channels = [this.smsProvider, this.telegramProvider];
  }

  async sendNotification(userId: string, type: NotificationType, data?: any): Promise<boolean> {
    const payload: NotificationPayload = {
      userId,
      type,
      data,
    };

    try {
      const results = await Promise.all(
        this.channels.map(channel => channel.send(payload))
      );

      // Return true if at least one channel succeeded
      return results.some(result => result === true);
    } catch (error) {
      console.error('Failed to send notifications:', error);
      return false;
    }
  }
} 