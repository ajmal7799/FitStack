"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotficationMapper = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class NotficationMapper {
    static toMongooseDocument(notification) {
        return {
            _id: new mongoose_1.default.Types.ObjectId(notification._id),
            recipientId: new mongoose_1.default.Types.ObjectId(notification.recipientId),
            recipientRole: notification.recipientRole,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            relatedId: notification.relatedId,
            isRead: notification.isRead,
            createdAt: notification.createdAt,
        };
    }
    static fromMongooseDocument(notification) {
        var _a;
        return {
            _id: notification._id.toString(),
            recipientId: notification.recipientId.toString(),
            recipientRole: notification.recipientRole,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            relatedId: (_a = notification.relatedId) === null || _a === void 0 ? void 0 : _a.toString(),
            isRead: notification.isRead,
            createdAt: notification.createdAt,
        };
    }
}
exports.NotficationMapper = NotficationMapper;
