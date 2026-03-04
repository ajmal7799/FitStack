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
exports.SendingMessageUseCase = void 0;
const exceptions_1 = require("../../constants/exceptions");
const error_1 = require("../../../shared/constants/error");
const MessageTypeEnums_1 = require("../../../domain/enum/MessageTypeEnums");
class SendingMessageUseCase {
    constructor(_messageRepository, _chatRepository, _storageService) {
        this._messageRepository = _messageRepository;
        this._chatRepository = _chatRepository;
        this._storageService = _storageService;
    }
    sendMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { chatId, senderId, type, text, attachment } = data;
            const chat = yield this._chatRepository.findById(chatId);
            if (!chat) {
                throw new exceptions_1.NotFoundException(error_1.CHAT_ERRORS.CHAT_NOT_FOUND);
            }
            if (type === MessageTypeEnums_1.MessageTypeEnums.TEXT) {
                if (!text || text.trim() === "") {
                    throw new Error("Text message cannot be empty");
                }
            }
            if (type !== MessageTypeEnums_1.MessageTypeEnums.TEXT) {
                if (!attachment) {
                    throw new Error("Attachment required for non-text message");
                }
            }
            const messageData = {
                chatId,
                senderId,
                type,
                text,
                attachment, // ← stores only key/fileName/fileType/fileSize (no url)
                isDeleted: false,
                createdAt: new Date().toISOString(),
            };
            console.log('💾 Saving message with attachment:', JSON.stringify(messageData.attachment));
            const savedMessage = yield this._messageRepository.save(messageData);
            console.log('✅ Saved message attachment:', JSON.stringify(savedMessage.attachment));
            // Last message preview
            let previewText = "";
            switch (type) {
                case MessageTypeEnums_1.MessageTypeEnums.TEXT:
                    previewText = text;
                    break;
                case MessageTypeEnums_1.MessageTypeEnums.IMAGE:
                    previewText = "📷 Image";
                    break;
                case MessageTypeEnums_1.MessageTypeEnums.FILE:
                    previewText = "📄 File";
                    break;
                case MessageTypeEnums_1.MessageTypeEnums.VIDEO:
                    previewText = "🎥 Video";
                    break;
                case MessageTypeEnums_1.MessageTypeEnums.AUDIO:
                    previewText = "🎵 Audio";
                    break;
            }
            const isUserSending = senderId === chat.userId;
            const incrementUnreadFor = isUserSending ? 'trainer' : 'user';
            yield this._chatRepository.updateLastMessage(chatId, {
                lastMessage: previewText,
                senderId: senderId,
                incrementUnreadFor: incrementUnreadFor,
            });
            // Resolve signed URL for attachment before emitting to clients
            if ((_a = savedMessage.attachment) === null || _a === void 0 ? void 0 : _a.key) {
                const signedUrl = yield this._storageService.createSignedUrl(savedMessage.attachment.key, 60 * 60 // 1 hour
                );
                return Object.assign(Object.assign({}, savedMessage), { attachment: Object.assign(Object.assign({}, savedMessage.attachment), { url: signedUrl }) });
            }
            return savedMessage;
        });
    }
}
exports.SendingMessageUseCase = SendingMessageUseCase;
