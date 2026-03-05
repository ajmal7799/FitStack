"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MessageTypeEnums_1 = require("../../../domain/enum/MessageTypeEnums");
const messageSchema = new mongoose_1.default.Schema({
    chatId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
    },
    senderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(MessageTypeEnums_1.MessageTypeEnums),
        required: true,
    },
    text: {
        type: String,
        trim: true,
    },
    attachment: {
        key: { type: String },
        fileName: { type: String },
        fileType: { type: String },
        fileSize: { type: Number },
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
    },
}, { timestamps: true });
messageSchema.index({ chatId: 1, createdAt: 1 });
exports.default = messageSchema;
