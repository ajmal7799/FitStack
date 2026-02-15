import { ISendingMessageUseCase } from '../../useCase/chat/ISendingMessageUseCase';
import { IMessageRepository } from '../../../domain/interfaces/repositories/IMessageRepository';
import { Message } from '../../../domain/entities/chat/messageEnitity';
import { IChatRepository } from '../../../domain/interfaces/repositories/IChatRepository';
import { NotFoundException } from '../../constants/exceptions';
import { CHAT_ERRORS } from '../../../shared/constants/error';

export class SendingMessageUseCase implements ISendingMessageUseCase {
  constructor(
    private _messageRepository: IMessageRepository,
    private _chatRepository: IChatRepository
  ) {}

  async sendMessage(chatId: string, senderId: string, text: string): Promise<Message> {
    const chat = await this._chatRepository.findById(chatId);
    if (!chat) {
      throw new NotFoundException(CHAT_ERRORS.CHAT_NOT_FOUND);
    }

    const messageData: Partial<Message> = {
      chatId,
      senderId,
      text,
      createdAt: new Date().toISOString(),
    };

    const savedMessage = await this._messageRepository.save(messageData as Message);

    const isUserSending = senderId === chat.userId;
    const incrementUnreadFor = isUserSending ? 'trainer' : 'user';

    await this._chatRepository.updateLastMessage(chatId, { lastMessage: text, senderId: senderId, incrementUnreadFor: incrementUnreadFor });
    return savedMessage;
  }
}
