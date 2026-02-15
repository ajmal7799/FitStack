import { IInitiateTrainerChatUseCase } from '../../useCase/chat/IInitiateTrainerChatUseCase';
import { IInitiateChatUseCase } from '../../useCase/chat/IInitiateChatUseCase';
import { ITrainerSelectRepository } from '../../../domain/interfaces/repositories/ITrainerSelectRepository';
import { NotFoundException } from '../../constants/exceptions';
import { USER_ERRORS, TRAINER_ERRORS } from '../../../shared/constants/error';
import { IUserRepository } from '../../../domain/interfaces/repositories/IUserRepository';
import { IChatRepository } from '../../../domain/interfaces/repositories/IChatRepository';
import { ChatMapper } from '../../mappers/chatMappers';
import { CreateChatDTO } from '../../dto/chat/createChatDTO';
import { TrainerOpenChatPageResponseDTO, UserOpenChatPageResponseDTO } from '../../dto/chat/userOpenChatPageDTO';
import { IStorageService } from '../../../domain/interfaces/services/IStorage/IStorageService';

export class InitiateTrainerChatUseCase implements IInitiateTrainerChatUseCase {
  constructor(
    private _trainerSelectRepository: ITrainerSelectRepository,
    private _chatRepository: IChatRepository,
    private _userRepository: IUserRepository,
    private _storageService: IStorageService
  ) {}

  async initiateChatTrainer(trainerId: string): Promise<TrainerOpenChatPageResponseDTO[]> {
    // 1. Get ALL users who selected this trainer
    const selections = await this._trainerSelectRepository.findByTrainerId(trainerId);

    if (!selections || selections.length === 0) {
      throw new NotFoundException(TRAINER_ERRORS.NO_USERS_SELECTED_YET);
    }

    // 2. Process each selection in parallel
    const trainerChatList = await Promise.all(
      selections.map(async selection => {
        const userId = selection.userId.toString();

        // Check if chat exists, if not, create it
        let chat = await this._chatRepository.findByParticipants(userId, trainerId);

        if (!chat) {
          const data: CreateChatDTO = {
            userId,
            trainerId,
            createdAt: new Date().toISOString(),
          };
          const chatDoc = ChatMapper.toEntity(data);
          chat = await this._chatRepository.save(chatDoc);
        }

        // Fetch the USER'S info (since the trainer needs to see who the client is)
        const user = await this._userRepository.findById(userId);

        const userProfilePic = user?.profileImage
          ? await this._storageService.createSignedUrl(user.profileImage, 10 * 60)
          : null;

        return {
          chatId: chat._id,
          userName: user ? user.name : 'Unknown User',
          userProfilePic: userProfilePic,
          userId: userId,
          unreadCount: chat.unreadCount.trainer || 0,
          lastMessage: chat.lastMessage
            ? {
                text: chat.lastMessage,
                timestamp: chat.updatedAt, // Use the last update time
                senderId: chat.lastSenderId || '',
              }
            : undefined,
        };
      })
    );

    return trainerChatList;
  }
}
