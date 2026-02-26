
export interface IMarkAsReadUseCase {
  markOne(notificationId: string): Promise<void>;
  markAll(recipientId: string): Promise<void>;
  clearAll(recipientId: string): Promise<void>;
} 