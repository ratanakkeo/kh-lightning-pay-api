import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationChannel, NotificationPayload } from '../interfaces/notification-channel.interface';
import * as twilio from 'twilio';

@Injectable()
export class SmsProvider implements NotificationChannel {
  private twilioClient: twilio.Twilio;

  constructor(private configService: ConfigService) {
    this.twilioClient = twilio(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_AUTH_TOKEN')
    );
  }

  async send(payload: NotificationPayload): Promise<boolean> {
    try {
      const userPhone = await this.getUserPhone(payload.userId);
      if (!userPhone) return false;

      const message = this.formatMessage(payload);
      
      await this.twilioClient.messages.create({
        body: message,
        to: userPhone,
        from: this.configService.get('TWILIO_PHONE_NUMBER'),
      });

      return true;
    } catch (error) {
      console.error('SMS notification failed:', error);
      return false;
    }
  }

  private formatMessage(payload: NotificationPayload): string {
    const messages = {
      SALE_NOTIFICATION: `New sale! Amount: ${payload.data.amount}. Escrow ID: ${payload.data.escrowId}`,
      SHIPMENT_NOTIFICATION: `Your order has been shipped! Escrow ID: ${payload.data.escrowId}`,
      DISPUTE_NOTIFICATION: `Dispute opened for escrow ${payload.data.escrowId}. Reason: ${payload.data.reason}`,
    };

    return messages[payload.type] || JSON.stringify(payload);
  }

  private async getUserPhone(userId: string): Promise<string | null> {
    // TODO: Implement user phone number lookup from your user service
    return '+1234567890'; // Placeholder
  }
} 