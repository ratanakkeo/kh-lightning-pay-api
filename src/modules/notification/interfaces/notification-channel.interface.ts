export interface NotificationPayload {
  userId: string;
  type: string;
  data?: any;
}

export interface NotificationChannel {
  send(payload: NotificationPayload): Promise<boolean>;
} 