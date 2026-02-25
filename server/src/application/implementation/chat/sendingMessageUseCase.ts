import { ISendingMessageUseCase } from '../../useCase/chat/ISendingMessageUseCase';
import { IMessageRepository } from '../../../domain/interfaces/repositories/IMessageRepository';
import { Message } from '../../../domain/entities/chat/messageEnitity';
import { IChatRepository } from '../../../domain/interfaces/repositories/IChatRepository';
import { NotFoundException } from '../../constants/exceptions';
import { CHAT_ERRORS } from '../../../shared/constants/error';
import { SendMessageDTO } from '../../dto/chat/SendMessageDTO';
import { IStorageService } from '../../../domain/interfaces/services/IStorage/IStorageService';
import { MessageTypeEnums } from '../../../domain/enum/MessageTypeEnums';

export class SendingMessageUseCase implements ISendingMessageUseCase {
  constructor(
    private _messageRepository: IMessageRepository,
    private _chatRepository: IChatRepository,
    private _storageService: IStorageService
  ) {}

  async sendMessage(data: SendMessageDTO): Promise<Message> {
    const { chatId, senderId, type, text, attachment } = data;

    const chat = await this._chatRepository.findById(chatId);
    if (!chat) {
      throw new NotFoundException(CHAT_ERRORS.CHAT_NOT_FOUND);
    }

    if (type === MessageTypeEnums.TEXT) {
      if (!text || text.trim() === "") {
        throw new Error("Text message cannot be empty");
      }
    }

    if (type !== MessageTypeEnums.TEXT) {
      if (!attachment) {
        throw new Error("Attachment required for non-text message");
      }
    }

    const messageData: Partial<Message> = {
      chatId,
      senderId,
      type,
      text,
      attachment,      // ← stores only key/fileName/fileType/fileSize (no url)
      isDeleted: false,
      createdAt: new Date().toISOString(),  
    };

console.log('💾 Saving message with attachment:', JSON.stringify(messageData.attachment));
const savedMessage = await this._messageRepository.save(messageData as Message);
console.log('✅ Saved message attachment:', JSON.stringify(savedMessage.attachment));
    // Last message preview
    let previewText = "";
    switch (type) {
      case MessageTypeEnums.TEXT:
        previewText = text!;
        break;
      case MessageTypeEnums.IMAGE:
        previewText = "📷 Image";
        break;
      case MessageTypeEnums.FILE:
        previewText = "📄 File";
        break;
      case MessageTypeEnums.VIDEO:
        previewText = "🎥 Video";
        break;
      case MessageTypeEnums.AUDIO:
        previewText = "🎵 Audio";
        break;
    }

    const isUserSending = senderId === chat.userId;
    const incrementUnreadFor = isUserSending ? 'trainer' : 'user';

    await this._chatRepository.updateLastMessage(chatId, {
      lastMessage: previewText,
      senderId: senderId,
      incrementUnreadFor: incrementUnreadFor,
    });

    // Resolve signed URL for attachment before emitting to clients
    if (savedMessage.attachment?.key) {
      const signedUrl = await this._storageService.createSignedUrl(
        savedMessage.attachment.key,
        60 * 60  // 1 hour
      );
      return {
        ...savedMessage,
        attachment: {
          ...savedMessage.attachment,
          url: signedUrl,  // ← clients use this to render the file
        },
      };
    }

    return savedMessage;
  }
}