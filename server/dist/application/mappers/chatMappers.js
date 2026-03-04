"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMapper = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class ChatMapper {
    static toMongooseDocument(chat) {
        return {
            _id: new mongoose_1.default.Types.ObjectId(chat._id),
            userId: new mongoose_1.default.Types.ObjectId(chat.userId),
            trainerId: new mongoose_1.default.Types.ObjectId(chat.trainerId),
            unreadCount: chat.unreadCount, // ✅ Include nested unread count
            lastMessage: chat.lastMessage,
            lastSenderId: chat.lastSenderId ? new mongoose_1.default.Types.ObjectId(chat.lastSenderId) : undefined,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt,
        };
    }
    static fromMongooseDocument(chat) {
        return {
            _id: chat._id.toString(),
            userId: chat.userId.toString(),
            trainerId: chat.trainerId.toString(),
            lastMessage: chat.lastMessage,
            lastSenderId: chat.lastSenderId ? chat.lastSenderId.toString() : '',
            unreadCount: chat.unreadCount || { user: 0, trainer: 0 },
            createdAt: chat.createdAt.toISOString(),
            updatedAt: chat.updatedAt.toISOString(),
        };
    }
    static toEntity(chatDoc) {
        return {
            _id: new mongoose_1.default.Types.ObjectId().toString(),
            userId: chatDoc.userId.toString(),
            trainerId: chatDoc.trainerId.toString(),
            lastMessage: '',
            lastSenderId: '',
            unreadCount: { user: 0, trainer: 0 },
            createdAt: chatDoc.createdAt,
            updatedAt: chatDoc.createdAt,
        };
    }
}
exports.ChatMapper = ChatMapper;
