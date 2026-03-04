"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageMapper = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class MessageMapper {
    static toMongooseDocument(message) {
        return {
            _id: new mongoose_1.default.Types.ObjectId(message._id),
            chatId: new mongoose_1.default.Types.ObjectId(message.chatId),
            senderId: new mongoose_1.default.Types.ObjectId(message.senderId),
            type: message.type,
            text: message.text,
            attachment: message.attachment
                ? {
                    key: message.attachment.key,
                    fileName: message.attachment.fileName,
                    fileType: message.attachment.fileType,
                    fileSize: message.attachment.fileSize,
                }
                : undefined,
            isDeleted: message.isDeleted,
            deletedAt: message.deletedAt ? new Date(message.deletedAt) : undefined,
            createdAt: message.createdAt
        };
    }
    static fromMongooseDocument(message) {
        var _a, _b;
        return {
            _id: message._id.toString(),
            chatId: message.chatId.toString(),
            senderId: message.senderId.toString(),
            type: message.type,
            attachment: message.attachment
                ? {
                    key: message.attachment.key,
                    fileName: message.attachment.fileName,
                    fileType: message.attachment.fileType,
                    fileSize: message.attachment.fileSize,
                }
                : undefined,
            text: message.text,
            isDeleted: message.isDeleted,
            deletedAt: (_a = message.deletedAt) === null || _a === void 0 ? void 0 : _a.toISOString(),
            createdAt: (_b = message.createdAt) === null || _b === void 0 ? void 0 : _b.toISOString(),
        };
    }
}
exports.MessageMapper = MessageMapper;
