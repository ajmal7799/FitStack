"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userEnums_1 = require("../../../domain/enum/userEnums");
const NotificationEnums_1 = require("../../../domain/enum/NotificationEnums");
const notificationSchema = new mongoose_1.default.Schema({
    recipientId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    recipientRole: { type: String, enum: Object.values(userEnums_1.UserRole), required: true },
    type: { type: String, enum: Object.values(NotificationEnums_1.NotificationType), required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedId: { type: String, default: null },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });
exports.default = notificationSchema;
