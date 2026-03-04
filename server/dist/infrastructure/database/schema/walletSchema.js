"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// infrastructure/database/schema/walletSchema.ts
const mongoose_1 = __importDefault(require("mongoose"));
const WalletTransactionType_1 = require("../../../domain/enum/WalletTransactionType");
const walletTransactionSchema = new mongoose_1.default.Schema({
    type: { type: String, enum: Object.values(WalletTransactionType_1.WalletTransactionType), required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    relatedId: { type: String },
    createdAt: { type: Date, default: Date.now },
});
const walletSchema = new mongoose_1.default.Schema({
    ownerId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    ownerType: { type: String, enum: ['user', 'trainer', 'admin'], required: true },
    balance: { type: Number, default: 0 },
    transactions: [walletTransactionSchema],
}, { timestamps: true });
walletSchema.index({ ownerId: 1, ownerType: 1 }, { unique: true });
exports.default = walletSchema;
