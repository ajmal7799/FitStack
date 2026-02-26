import { Notification } from "../../../domain/entities/Notification/NotificationEntity";

export interface ICreateNotification {
    execute(data: Omit<Notification, '_id' | 'createdAt'>): Promise<Notification>;
}