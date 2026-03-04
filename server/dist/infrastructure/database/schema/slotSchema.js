"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SlotEnums_1 = require("../../../domain/enum/SlotEnums");
const slotSchema = new mongoose_1.default.Schema({
    trainerId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    isBooked: { type: Boolean, default: false },
    slotStatus: { type: String, enum: Object.values(SlotEnums_1.SlotStatus), default: SlotEnums_1.SlotStatus.AVAILABLE },
    bookedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });
slotSchema.index({ trainerId: 1, startTime: 1, endTime: 1 });
exports.default = slotSchema;
