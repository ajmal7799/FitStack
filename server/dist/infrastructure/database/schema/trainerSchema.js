"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const trainerSchema = new mongoose_1.default.Schema({
    trainerId: { type: String, required: true, unique: true },
    qualification: { type: String, required: true },
    specialisation: { type: String, required: true },
    experience: { type: Number, required: true },
    about: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
}, {
    timestamps: true,
});
exports.default = trainerSchema;
