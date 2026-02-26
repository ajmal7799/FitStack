import { Notification } from "../../entities/Notification/NotificationEntity";
import { IBaseRepository } from "./IBaseRepository";
import { UserRole } from "../../enum/userEnums";
import { NotificationType } from "../../enum/NotificationEnums";


export interface INotificationRepository extends IBaseRepository<Notification> {
    findByRecipientId(recipientId: string): Promise<Notification[]>;
    markAsRead(notificationId: string): Promise<void>;
    markAllAsRead(recipientId: string): Promise<void>;
    getUnreadCount(recipientId: string): Promise<number>;
      deleteAll(recipientId: string): Promise<void>;

}