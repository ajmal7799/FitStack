import { ICreateNotification } from '../../useCase/notification/ICreateNotification';
import { Notification } from '../../../domain/entities/Notification/NotificationEntity';
import { INotificationRepository } from '../../../domain/interfaces/repositories/INotificationRepository';
import { NotificationType } from '../../../domain/enum/NotificationEnums';
import { SocketService } from '../../../infrastructure/socket/socketServer';

export class CreateNotification {
  constructor(private _notificationRepository: INotificationRepository) {}
  async execute(data: Omit<Notification, '_id' | 'createdAt'>): Promise<Notification> {
    const saved = await this._notificationRepository.save(data);

    try {
      const io = SocketService.io;
      const room = saved.recipientId.toString();
      console.log(`🔔 Emitting notification to user room: ${room}`);
      io.to(room).emit('receive_notification', saved);
    } catch (error) {
      console.warn('⚠️ Socket not available for notification emit');
    }

    return saved;
  }
}
