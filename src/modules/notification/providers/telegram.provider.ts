import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationChannel, NotificationPayload } from '../interfaces/notification-channel.interface';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramProvider implements NotificationChannel {
  private bot: Telegraf;

  constructor(private configService: ConfigService) {
    this.bot = new Telegraf(this.configService.get('TELEGRAM_BOT_TOKEN'));
    this.initializeBot();
  }

  private initializeBot() {
    this.bot.launch().catch(error => {
      console.error('Failed to launch Telegram bot:', error);
    });
  }

  async send(payload: NotificationPayload): Promise<boolean> {
    try {
      const chatId = await this.getUserChatId(payload.userId);
      if (!chatId) return false;

      const message = this.formatMessage(payload);
      
      await this.bot.telegram.sendMessage(chatId, message, {
        parse_mode: 'HTML',
      });

      return true;
    } catch (error) {
      console.error('Telegram notification failed:', error);
      return false;
    }
  }

  private formatMessage(payload: NotificationPayload): string {
    const messages = {
      SALE_NOTIFICATION: `🛍 <b>New Sale!</b>\n\nAmount: ${payload.data.amount}\nEscrow ID: <code>${payload.data.escrowId}</code>`,
      SHIPMENT_NOTIFICATION: `📦 <b>Order Shipped!</b>\n\nEscrow ID: <code>${payload.data.escrowId}</code>`,
      DISPUTE_NOTIFICATION: `⚠️ <b>Dispute Opened</b>\n\nEscrow ID: <code>${payload.data.escrowId}</code>\nReason: ${payload.data.reason}`,
    };

    return messages[payload.type] || JSON.stringify(payload);
  }

  private async getUserChatId(userId: string): Promise<string | null> {
    // TODO: Implement user Telegram chat ID lookup from your user service
    return '123456789'; // Placeholder
  }
} 