"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const videoCallEnums_1 = require("../../../domain/enum/videoCallEnums");
const userEnums_1 = require("../../../domain/enum/userEnums");
const videoCallSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    trainerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    slotId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Slot',
        required: true
    },
    roomId: {
        type: String,
        required: true,
        unique: true // Usually critical for video signaling logic
    },
    trainerJoined: {
        type: Boolean,
        default: false
    },
    userJoined: {
        type: Boolean,
        default: false
    },
    startedAt: {
        type: Date
    },
    endedAt: {
        type: Date
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(videoCallEnums_1.VideoCallStatus),
        default: videoCallEnums_1.VideoCallStatus.WAITING // Adjust default based on your enum
    },
    cancellationReason: { type: String, default: null },
    cancelledAt: { type: Date, default: null },
    cancelledBy: { type: String, enum: Object.values(userEnums_1.UserRole), default: null },
}, { timestamps: true });
videoCallSchema.index({ userId: 1, startedAt: -1 });
videoCallSchema.index({ trainerId: 1, startedAt: -1 });
exports.default = videoCallSchema;
