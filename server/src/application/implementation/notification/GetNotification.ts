import { IGetNotificationsUseCase } from "../../useCase/notification/IGetNotificationsUseCase";
import { INotificationRepository } from "../../../domain/interfaces/repositories/INotificationRepository";
import { Notification } from "../../../domain/entities/Notification/NotificationEntity";

export class GetNotificationsUseCase implements IGetNotificationsUseCase {
    constructor(private _notificationRepository: INotificationRepository) {}
    async execute(userId: string): Promise<{ notifications: Notification[]; unreadCount: number; }> {
        
        const [notifications, unreadCount] = await Promise.all([
            this._notificationRepository.findByRecipientId(userId),
            this._notificationRepository.getUnreadCount(userId)
        ])

        return { notifications, unreadCount };
    }
}