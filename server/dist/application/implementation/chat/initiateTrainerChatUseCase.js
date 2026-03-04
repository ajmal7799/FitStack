"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitiateTrainerChatUseCase = void 0;
const exceptions_1 = require("../../constants/exceptions");
const error_1 = require("../../../shared/constants/error");
const chatMappers_1 = require("../../mappers/chatMappers");
class InitiateTrainerChatUseCase {
    constructor(_trainerSelectRepository, _chatRepository, _userRepository, _storageService) {
        this._trainerSelectRepository = _trainerSelectRepository;
        this._chatRepository = _chatRepository;
        this._userRepository = _userRepository;
        this._storageService = _storageService;
    }
    initiateChatTrainer(trainerId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Get ALL users who selected this trainer
            const selections = yield this._trainerSelectRepository.findByTrainerId(trainerId);
            if (!selections || selections.length === 0) {
                throw new exceptions_1.NotFoundException(error_1.TRAINER_ERRORS.NO_USERS_SELECTED_YET);
            }
            // 2. Process each selection in parallel
            const trainerChatList = yield Promise.all(selections.map((selection) => __awaiter(this, void 0, void 0, function* () {
                const userId = selection.userId.toString();
                // Check if chat exists, if not, create it
                let chat = yield this._chatRepository.findByParticipants(userId, trainerId);
                if (!chat) {
                    const data = {
                        userId,
                        trainerId,
                        createdAt: new Date().toISOString(),
                    };
                    const chatDoc = chatMappers_1.ChatMapper.toEntity(data);
                    chat = yield this._chatRepository.save(chatDoc);
                }
                // Fetch the USER'S info (since the trainer needs to see who the client is)
                const user = yield this._userRepository.findById(userId);
                const userProfilePic = (user === null || user === void 0 ? void 0 : user.profileImage)
                    ? yield this._storageService.createSignedUrl(user.profileImage, 10 * 60)
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
            })));
            return trainerChatList;
        });
    }
}
exports.InitiateTrainerChatUseCase = InitiateTrainerChatUseCase;
