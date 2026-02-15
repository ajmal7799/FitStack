import { IBaseRepository } from './IBaseRepository';
import { Chat } from '../../entities/chat/chatEntity';
export interface IChatRepository extends IBaseRepository<Chat> {
  findByParticipants(userId: string, trainerId: string): Promise<Chat | null>;
  updateLastMessage(chatId: string, data: { lastMessage: string, senderId: string, incrementUnreadFor: 'user' | 'trainer' }): Promise<void>;
  resetUnreadCount(chatId: string, userType: 'user' | 'trainer' ): Promise<void>;
  updateLastMessageOnly(chatId: string, data: { lastMessage: string, senderId: string }): Promise<void>;

//   create(userId: string, trainerId: string): Promise<Chat>;
}
