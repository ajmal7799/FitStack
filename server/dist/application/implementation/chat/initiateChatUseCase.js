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
exports.InitiateChatUseCase = void 0;
const exceptions_1 = require("../../constants/exceptions");
const error_1 = require("../../../shared/constants/error");
const chatMappers_1 = require("../../mappers/chatMappers");
class InitiateChatUseCase {
    constructor(_trainerSelectRepository, _chatRepository, _userRepository, _storageService, _messageRepository) {
        this._trainerSelectRepository = _trainerSelectRepository;
        this._chatRepository = _chatRepository;
        this._userRepository = _userRepository;
        this._storageService = _storageService;
        this._messageRepository = _messageRepository;
    }
    initiateChat(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // 1. Get the selection/subscription
            const selection = yield this._trainerSelectRepository.findByUserId(userId);
            if (!selection)
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.USER_NOT_SELECTED);
            const trainerId = selection.trainerId.toString();
            const trainer = yield this._userRepository.findById(trainerId);
            if (!trainer)
                throw new exceptions_1.NotFoundException(error_1.TRAINER_ERRORS.TRAINER_NOT_FOUND);
            const trainerProfilePic = trainer.profileImage
                ? yield this._storageService.createSignedUrl(trainer.profileImage, 10 * 60)
                : null;
            // 2. Find or create chat
            let chat = yield this._chatRepository.findByParticipants(userId, trainerId);
            let message;
            if (chat) {
                message = yield this._messageRepository.findByChatId(chat._id);
            }
            if (!chat) {
                // Create new chat with initial unread counts set to 0
                const data = {
                    userId,
                    trainerId,
                    createdAt: new Date().toISOString(),
                };
                const chatDoc = chatMappers_1.ChatMapper.toEntity(data);
                chat = yield this._chatRepository.save(chatDoc);
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
                        senderId: ((_a = chat.lastSenderId) === null || _a === void 0 ? void 0 : _a.toString()) || '',
                        isDeleted: message ? message.some(msg => msg.text === chat.lastMessage && msg.isDeleted) : false,
                    }
                    : undefined,
            };
        });
    }
}
exports.InitiateChatUseCase = InitiateChatUseCase;
