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
exports.ChatController = void 0;
const error_1 = require("../../../shared/constants/error");
const responseHelper_1 = require("../../../shared/utils/responseHelper");
const messages_1 = require("../../../shared/constants/messages");
const exceptions_1 = require("../../../application/constants/exceptions");
class ChatController {
    constructor(_initiateChatUseCase, _getMessageUseCase, _initiateTrainerChatUseCase, _markAsReadUseCase, _deleteMessageUseCase, _getAttachmentUploadUrlUseCase) {
        this._initiateChatUseCase = _initiateChatUseCase;
        this._getMessageUseCase = _getMessageUseCase;
        this._initiateTrainerChatUseCase = _initiateTrainerChatUseCase;
        this._markAsReadUseCase = _markAsReadUseCase;
        this._deleteMessageUseCase = _deleteMessageUseCase;
        this._getAttachmentUploadUrlUseCase = _getAttachmentUploadUrlUseCase;
    }
    initiateChat(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                const result = yield this._initiateChatUseCase.initiateChat(userId);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.CHAT.INITIATE_CHAT_SUCCESS, { result }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    initiateChatTrainer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const trainerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!trainerId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                const result = yield this._initiateTrainerChatUseCase.initiateChatTrainer(trainerId);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.CHAT.INITIATE_CHAT_SUCCESS, { result }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getMessages(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const { chatId } = req.params;
                if (!userId && !chatId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                const messages = yield this._getMessageUseCase.getMessages(userId, chatId);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.CHAT.MESSAGES_FETCHED_SUCCESS, { messages }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    markAsRead(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { chatId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!chatId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                yield this._markAsReadUseCase.execute(chatId, userId);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.CHAT.MARK_AS_READ_SUCCESS, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { messageId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!messageId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                yield this._deleteMessageUseCase.execute(messageId, userId);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.CHAT.DELETE_MESSAGE_SUCCESS, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAttachment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { chatId, fileName, fileType } = req.query;
            if (!chatId || !fileName || !fileType) {
                throw new exceptions_1.InvalidDataException(error_1.Errors.INVALID_DATA);
            }
            const result = yield this._getAttachmentUploadUrlUseCase.execute(chatId, fileName, fileType);
            responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.CHAT.GET_ATTACHMENT_SUCCESS, result, 200 /* HTTPStatus.OK */);
        });
    }
}
exports.ChatController = ChatController;
