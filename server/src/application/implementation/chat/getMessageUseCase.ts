import { Message } from '../../../domain/entities/chat/messageEnitity';
import { IGetMessageUseCase } from '../../useCase/chat/IGetMessageUseCase';
import { IMessageRepository } from '../../../domain/interfaces/repositories/IMessageRepository';
import { IChatRepository } from '../../../domain/interfaces/repositories/IChatRepository';
import { NotFoundException } from '../../constants/exceptions';
import { CHAT_ERRORS, Errors } from '../../../shared/constants/error';
import { UnauthorizedException } from '../../constants/exceptions';

export class GetMessageUseCase implements IGetMessageUseCase {
  constructor(private _messageRepository: IMessageRepository, private _chatRepository: IChatRepository) {}

  async getMessages(userId: string, chatId: string): Promise<Message[]> {
    const chat = await this._chatRepository.findById(chatId);

    if (!chat) {
      throw new NotFoundException(CHAT_ERRORS.CHAT_NOT_FOUND);
    }

    if (chat.userId !== userId && chat.trainerId !== userId) {
      throw new UnauthorizedException(CHAT_ERRORS.ACCESS_DENIED);
    }

    return this._messageRepository.findByChatId(chatId);
  }
}
