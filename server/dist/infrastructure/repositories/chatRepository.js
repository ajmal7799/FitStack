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
exports.ChatRepository = void 0;
const baseRepository_1 = require("./baseRepository");
const chatMappers_1 = require("../../application/mappers/chatMappers");
class ChatRepository extends baseRepository_1.BaseRepository {
    constructor(_model) {
        super(_model, chatMappers_1.ChatMapper);
        this._model = _model;
    }
    findByParticipants(userId, trainerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._model.findOne({
                userId: userId,
                trainerId: trainerId,
            });
        });
    }
    updateLastMessage(chatId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const incrementField = `unreadCount.${data.incrementUnreadFor}`;
            yield this._model.findByIdAndUpdate(chatId, {
                $set: {
                    lastMessage: data.lastMessage,
                    lastSenderId: data.senderId,
                    updatedAt: new Date().toISOString(),
                },
                $inc: { [incrementField]: 1 },
            }, { new: true });
        });
    }
    resetUnreadCount(chatId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            const resetField = `unreadCount.${userType}`;
            yield this._model.findByIdAndUpdate(chatId, { $set: { [resetField]: 0 } }, { new: true });
        });
    }
    updateLastMessageOnly(chatId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._model.findByIdAndUpdate(chatId, {
                $set: {
                    lastMessage: data.lastMessage,
                    lastSenderId: data.senderId,
                    updatedAt: new Date().toISOString(),
                },
            }, { new: true });
        });
    }
}
exports.ChatRepository = ChatRepository;
