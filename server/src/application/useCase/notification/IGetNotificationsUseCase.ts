import { Notification } from "../../../domain/entities/Notification/NotificationEntity";


export interface IGetNotificationsUseCase {
    execute(userId: string): Promise<{notifications: Notification[]; unreadCount: number}>
}
