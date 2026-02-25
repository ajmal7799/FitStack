import { Message } from '../../../domain/entities/chat/messageEnitity';
import { IGetMessageUseCase } from '../../useCase/chat/IGetMessageUseCase';
import { IMessageRepository } from '../../../domain/interfaces/repositories/IMessageRepository';
import { IChatRepository } from '../../../domain/interfaces/repositories/IChatRepository';
import { NotFoundException, UnauthorizedException } from '../../constants/exceptions';
import { CHAT_ERRORS } from '../../../shared/constants/error';
import { IStorageService } from '../../../domain/interfaces/services/IStorage/IStorageService';

export class GetMessageUseCase implements IGetMessageUseCase {
  constructor(
    private _messageRepository: IMessageRepository,
    private _chatRepository: IChatRepository,
    private _storageService: IStorageService  // ← inject
  ) {}

  async getMessages(userId: string, chatId: string): Promise<Message[]> {
    const chat = await this._chatRepository.findById(chatId);

    if (!chat) {
      throw new NotFoundException(CHAT_ERRORS.CHAT_NOT_FOUND);
    }

    if (chat.userId !== userId && chat.trainerId !== userId) {
      throw new UnauthorizedException(CHAT_ERRORS.ACCESS_DENIED);
    }

    const messages = await this._messageRepository.findByChatId(chatId);

    // ✅ Resolve signed URLs for all attachment messages
    const messagesWithUrls = await Promise.all(
      messages.map(async (msg) => {
        if (msg.attachment?.key) {
          const url = await this._storageService.createSignedUrl(
            msg.attachment.key,
            60 * 60  // 1 hour
          );
          return {
            ...msg,
            attachment: { ...msg.attachment, url },
          };
        }
        return msg;
      })
    );

    return messagesWithUrls;
  }
}