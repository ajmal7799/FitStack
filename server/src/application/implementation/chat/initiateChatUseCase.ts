import { IInitiateChatUseCase } from '../../useCase/chat/IInitiateChatUseCase';
import { ITrainerSelectRepository } from '../../../domain/interfaces/repositories/ITrainerSelectRepository';
import { NotFoundException } from '../../constants/exceptions';
import { USER_ERRORS, TRAINER_ERRORS } from '../../../shared/constants/error';
import { IUserRepository } from '../../../domain/interfaces/repositories/IUserRepository';
import { IChatRepository } from '../../../domain/interfaces/repositories/IChatRepository';
import { ChatMapper } from '../../mappers/chatMappers';
import { CreateChatDTO } from '../../dto/chat/createChatDTO';
import { UserOpenChatPageResponseDTO } from '../../dto/chat/userOpenChatPageDTO';
import { IStorageService } from '../../../domain/interfaces/services/IStorage/IStorageService';
import { IMessageRepository } from '../../../domain/interfaces/repositories/IMessageRepository';

export class InitiateChatUseCase implements IInitiateChatUseCase {
  constructor(
    private _trainerSelectRepository: ITrainerSelectRepository,
    private _chatRepository: IChatRepository,
    private _userRepository: IUserRepository,
    private _storageService: IStorageService,
    private _messageRepository: IMessageRepository
  ) {}

  async initiateChat(userId: string): Promise<UserOpenChatPageResponseDTO> {
    // 1. Get the selection/subscription
    const selection = await this._trainerSelectRepository.findByUserId(userId);
    if (!selection) throw new NotFoundException(USER_ERRORS.USER_NOT_SELECTED);

    const trainerId = selection.trainerId.toString();
    const trainer = await this._userRepository.findById(trainerId);
    if (!trainer) throw new NotFoundException(TRAINER_ERRORS.TRAINER_NOT_FOUND);

    const trainerProfilePic = trainer.profileImage
      ? await this._storageService.createSignedUrl(trainer.profileImage, 10 * 60)
      : null;

    // 2. Find or create chat
    let chat = await this._chatRepository.findByParticipants(userId, trainerId);
let message;
    if (chat) {
       message = await this._messageRepository.findByChatId(chat._id);
    }

    if (!chat) {
      // Create new chat with initial unread counts set to 0
      const data: CreateChatDTO = {
        userId,
        trainerId,
        createdAt: new Date().toISOString(),
      };
      const chatDoc = ChatMapper.toEntity(data);
      chat = await this._chatRepository.save(chatDoc);
    }

    // 3. Return chat details with the USER's unread count (not trainer's)
    return {
      chatId: chat._id,
      trainerName: trainer.name,
      trainerProfilePic: trainerProfilePic,
      userId: userId,
      unreadCount: chat.unreadCount.user, // ✅ Return only the user's unread count
      lastMessage: chat.lastMessage
        ? {
            text: chat.lastMessage,
            timestamp: chat.updatedAt.toString(),
            senderId: chat.lastSenderId?.toString() || '',
            isDeleted: message ? message.some(msg => msg.text === chat.lastMessage && msg.isDeleted) : false,
          }
        : undefined,
    };
  }
}
