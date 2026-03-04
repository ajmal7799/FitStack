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
exports.MarkAsReadUseCase = void 0;
const exceptions_1 = require("../../constants/exceptions");
const error_1 = require("../../../shared/constants/error");
class MarkAsReadUseCase {
    constructor(_chatRepository) {
        this._chatRepository = _chatRepository;
    }
    execute(chatId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chat = yield this._chatRepository.findById(chatId);
            if (!chat) {
                throw new exceptions_1.NotFoundException(error_1.CHAT_ERRORS.CHAT_NOT_FOUND);
            }
            const userType = userId === chat.userId ? 'user' : 'trainer';
            yield this._chatRepository.resetUnreadCount(chatId, userType);
        });
    }
}
exports.MarkAsReadUseCase = MarkAsReadUseCase;
