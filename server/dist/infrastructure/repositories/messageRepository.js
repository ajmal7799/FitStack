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
exports.MessageRepository = void 0;
const baseRepository_1 = require("./baseRepository");
const messageMappers_1 = require("../../application/mappers/messageMappers");
class MessageRepository extends baseRepository_1.BaseRepository {
    constructor(_model) {
        super(_model, messageMappers_1.MessageMapper);
        this._model = _model;
    }
    findByChatId(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            const documents = yield this._model.find({ chatId: chatId }).sort({ createdAt: 1 });
            return documents.map((doc) => messageMappers_1.MessageMapper.fromMongooseDocument(doc));
        });
    }
    softDelete(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._model.findByIdAndUpdate(messageId, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true });
        });
    }
}
exports.MessageRepository = MessageRepository;
