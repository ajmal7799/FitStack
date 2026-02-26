// infrastructure/database/schema/walletSchema.ts
import mongoose from 'mongoose';
import { WalletTransactionType } from '../../../domain/enum/WalletTransactionType';

const walletTransactionSchema = new mongoose.Schema({
    type: { type: String, enum: Object.values(WalletTransactionType), required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    relatedId: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const walletSchema = new mongoose.Schema(
    {
        ownerId: { type: mongoose.Schema.Types.ObjectId, required: true },
        ownerType: { type: String, enum: ['user', 'trainer', 'admin'], required: true },
        balance: { type: Number, default: 0 },
        transactions: [walletTransactionSchema],
    },
    { timestamps: true }
);

walletSchema.index({ ownerId: 1, ownerType: 1 }, { unique: true });

export default walletSchema;