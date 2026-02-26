import { Notification } from "../../entities/Notification/NotificationEntity";
export interface IRealTimeService {
  sendNotification(recipientId: string, data: Notification): void;
}