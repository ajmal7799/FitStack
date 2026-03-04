"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    trainerId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    lastMessage: { type: String, default: '' },
    lastSenderId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    unreadCount: {
        user: { type: Number, default: 0 },
        trainer: { type: Number, default: 0 },
    },
}, { timestamps: true });
chatSchema.index({ userId: 1, trainerId: 1 }, { unique: true });
exports.default = chatSchema;
