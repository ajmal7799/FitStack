import { IMarkAsReadUseCase } from '../../useCase/notification/IMarkAsReadUseCase';
import { INotificationRepository } from '../../../domain/interfaces/repositories/INotificationRepository';

export class MarkAsReadUseCase implements IMarkAsReadUseCase {
  constructor(private _notificationRepository: INotificationRepository) {}
  async markOne(notificationId: string): Promise<void> {
    await this._notificationRepository.markAsRead(notificationId);
  }

  async markAll(recipientId: string): Promise<void> {
    await this._notificationRepository.markAllAsRead(recipientId);
  }

  async clearAll(recipientId: string): Promise<void> {
    await this._notificationRepository.deleteAll(recipientId);
  }
}
