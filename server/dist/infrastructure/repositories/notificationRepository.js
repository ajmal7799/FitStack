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
exports.NotificationRepository = void 0;
const baseRepository_1 = require("./baseRepository");
const notificationMappers_1 = require("../../application/mappers/notificationMappers");
class NotificationRepository extends baseRepository_1.BaseRepository {
    constructor(_model) {
        super(_model, notificationMappers_1.NotficationMapper);
        this._model = _model;
    }
    findByRecipientId(recipientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notifications = yield this._model.find({ recipientId: recipientId }).sort({ createdAt: -1 });
            return notifications.map((doc) => notificationMappers_1.NotficationMapper.fromMongooseDocument(doc));
        });
    }
    markAsRead(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._model.findByIdAndUpdate(notificationId, { $set: { isRead: true } });
        });
    }
    markAllAsRead(recipientId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._model.updateMany({ recipientId: recipientId }, { $set: { isRead: true } });
        });
    }
    getUnreadCount(recipientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield this._model.countDocuments({ recipientId: recipientId, isRead: false });
            return count;
        });
    }
    deleteAll(recipientId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._model.deleteMany({ recipientId: recipientId });
        });
    }
}
exports.NotificationRepository = NotificationRepository;
