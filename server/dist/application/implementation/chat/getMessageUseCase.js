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
exports.GetMessageUseCase = void 0;
const exceptions_1 = require("../../constants/exceptions");
const error_1 = require("../../../shared/constants/error");
class GetMessageUseCase {
    constructor(_messageRepository, _chatRepository, _storageService // ← inject
    ) {
        this._messageRepository = _messageRepository;
        this._chatRepository = _chatRepository;
        this._storageService = _storageService;
    }
    getMessages(userId, chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chat = yield this._chatRepository.findById(chatId);
            if (!chat) {
                throw new exceptions_1.NotFoundException(error_1.CHAT_ERRORS.CHAT_NOT_FOUND);
            }
            if (chat.userId !== userId && chat.trainerId !== userId) {
                throw new exceptions_1.UnauthorizedException(error_1.CHAT_ERRORS.ACCESS_DENIED);
            }
            const messages = yield this._messageRepository.findByChatId(chatId);
            // ✅ Resolve signed URLs for all attachment messages
            const messagesWithUrls = yield Promise.all(messages.map((msg) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if ((_a = msg.attachment) === null || _a === void 0 ? void 0 : _a.key) {
                    const url = yield this._storageService.createSignedUrl(msg.attachment.key, 60 * 60 // 1 hour
                    );
                    return Object.assign(Object.assign({}, msg), { attachment: Object.assign(Object.assign({}, msg.attachment), { url }) });
                }
                return msg;
            })));
            return messagesWithUrls;
        });
    }
}
exports.GetMessageUseCase = GetMessageUseCase;
