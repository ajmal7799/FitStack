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
exports.DeleteMessageUseCase = void 0;
const exceptions_1 = require("../../constants/exceptions");
const error_1 = require("../../../shared/constants/error");
const MessageTypeEnums_1 = require("../../../domain/enum/MessageTypeEnums");
class DeleteMessageUseCase {
    constructor(_messageRepository, _chatRepository) {
        this._messageRepository = _messageRepository;
        this._chatRepository = _chatRepository;
    }
    execute(messageId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield this._messageRepository.findById(messageId);
            if (!message) {
                throw new exceptions_1.NotFoundException(error_1.CHAT_ERRORS.MESSAGE_NOT_FOUND);
            }
            if (message.isDeleted) {
                throw new exceptions_1.NotFoundException(error_1.CHAT_ERRORS.MESSAGE_ALREADY_DELETED);
            }
            if (message.senderId !== userId) {
                throw new exceptions_1.UnauthorizedException(error_1.CHAT_ERRORS.YOU_CAN_ONLY_DELETE_YOUR_OWN_MESSAGE);
            }
            yield this._messageRepository.softDelete(messageId);
            const chat = yield this._chatRepository.findById(message.chatId);
            if (chat && chat.lastMessage === message.text) {
                const messages = yield this._messageRepository.findByChatId(message.chatId);
                const nonDeletedMessages = messages.filter(msg => !msg.isDeleted);
                const lastMessage = nonDeletedMessages[nonDeletedMessages.length - 1];
                if (lastMessage) {
                    const isUserSender = lastMessage.senderId === chat.userId;
                    const incrementUnreadFor = isUserSender ? 'trainer' : 'user';
                    let previewText = '';
                    switch (lastMessage.type) {
                        case MessageTypeEnums_1.MessageTypeEnums.TEXT:
                            previewText = lastMessage.text;
                            break;
                        case MessageTypeEnums_1.MessageTypeEnums.IMAGE:
                            previewText = '📷 Image';
                            break;
                        case MessageTypeEnums_1.MessageTypeEnums.FILE:
                            previewText = '📄 File';
                            break;
                        case MessageTypeEnums_1.MessageTypeEnums.VIDEO:
                            previewText = '🎥 Video';
                            break;
                        case MessageTypeEnums_1.MessageTypeEnums.AUDIO:
                            previewText = '🎵 Audio';
                            break;
                    }
                    yield this._chatRepository.updateLastMessage(message.chatId, {
                        lastMessage: previewText,
                        senderId: lastMessage.senderId,
                        incrementUnreadFor: incrementUnreadFor,
                    });
                }
                else {
                    yield this._chatRepository.updateLastMessageOnly(message.chatId, {
                        lastMessage: '',
                        senderId: '',
                    });
                }
            }
        });
    }
}
exports.DeleteMessageUseCase = DeleteMessageUseCase;
