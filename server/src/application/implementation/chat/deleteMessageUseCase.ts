import { IDeleteMessagesUseCase } from '../../useCase/chat/IDeleteMessagesUseCase';
import { IMessageRepository } from '../../../domain/interfaces/repositories/IMessageRepository';
import { IChatRepository } from '../../../domain/interfaces/repositories/IChatRepository';
import { NotFoundException, UnauthorizedException } from '../../constants/exceptions';
import { CHAT_ERRORS } from '../../../shared/constants/error';
import { MessageTypeEnums } from '../../../domain/enum/MessageTypeEnums';

export class DeleteMessageUseCase implements IDeleteMessagesUseCase {
  constructor(
    private _messageRepository: IMessageRepository,
    private _chatRepository: IChatRepository
  ) {}

  async execute(messageId: string, userId: string): Promise<void> {
    const message = await this._messageRepository.findById(messageId);
    if (!message) {
      throw new NotFoundException(CHAT_ERRORS.MESSAGE_NOT_FOUND);
    }

    if (message.isDeleted) {
      throw new NotFoundException(CHAT_ERRORS.MESSAGE_ALREADY_DELETED);
    }

    if (message.senderId !== userId) {
      throw new UnauthorizedException(CHAT_ERRORS.YOU_CAN_ONLY_DELETE_YOUR_OWN_MESSAGE);
    }

    await this._messageRepository.softDelete(messageId);

    const chat = await this._chatRepository.findById(message.chatId);
    if (chat && chat.lastMessage === message.text) {
      const messages = await this._messageRepository.findByChatId(message.chatId);
      const nonDeletedMessages = messages.filter(msg => !msg.isDeleted);
      const lastMessage = nonDeletedMessages[nonDeletedMessages.length - 1];

      if (lastMessage) {
        const isUserSender = lastMessage.senderId === chat.userId;
        const incrementUnreadFor = isUserSender ? 'trainer' : 'user';
        let previewText = '';
        switch (lastMessage.type) {
          case MessageTypeEnums.TEXT:
            previewText = lastMessage.text!;
            break;
          case MessageTypeEnums.IMAGE:
            previewText = '📷 Image';
            break;
          case MessageTypeEnums.FILE:
            previewText = '📄 File';
            break;
          case MessageTypeEnums.VIDEO:
            previewText = '🎥 Video';
            break;
          case MessageTypeEnums.AUDIO:
            previewText = '🎵 Audio';
            break;  
        }

        await this._chatRepository.updateLastMessage(message.chatId, {
          lastMessage: previewText,
          senderId: lastMessage.senderId,
          incrementUnreadFor: incrementUnreadFor,
        });
      } else {
        await this._chatRepository.updateLastMessageOnly(message.chatId, {
          lastMessage: '',
          senderId: '',
        });
      }
    }
  }
}
