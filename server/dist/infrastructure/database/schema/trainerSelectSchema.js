"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const trainerSelectionEnums_1 = require("../../../domain/enum/trainerSelectionEnums");
const trainerSelectSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    trainerId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: Object.values(trainerSelectionEnums_1.TrainerSelectionStatus), required: true },
    selectedAt: { type: Date, default: Date.now },
}, { timestamps: true });
exports.default = trainerSelectSchema;
