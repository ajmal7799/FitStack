"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const verificationStatus_1 = require("../../../domain/enum/verificationStatus");
const verificationSchema = new mongoose_1.default.Schema({
    trainerId: { type: String, required: true, unique: true },
    idCard: { type: String, required: true },
    educationCert: { type: String, required: true },
    experienceCert: { type: String, required: true },
    verificationStatus: { type: String, required: true, enum: Object.values(verificationStatus_1.VerificationStatus), default: verificationStatus_1.VerificationStatus.PENDING },
    rejectionReason: { type: String },
    submittedAt: { type: Date, required: true },
});
exports.default = verificationSchema;
