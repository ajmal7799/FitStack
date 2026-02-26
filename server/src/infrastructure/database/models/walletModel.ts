// infrastructure/database/models/walletModel.ts
import { Document, model, Types } from 'mongoose';
import walletSchema from '../schema/walletSchema';
import { WalletTransactionType } from '../../../domain/enum/WalletTransactionType';

export interface IWalletTransactionModel {
    _id: Types.ObjectId;
    type: WalletTransactionType;
    amount: number;
    description: string;
    relatedId?: Types.ObjectId;
    createdAt: Date;
}

export interface IWalletModel extends Document {
    _id: Types.ObjectId;
    ownerId: Types.ObjectId;
    ownerType: 'user' | 'trainer' | 'admin';
    balance: number;
    transactions: IWalletTransactionModel[];
    createdAt: Date;
    updatedAt: Date;
}

export const walletModel = model<IWalletModel>('Wallet', walletSchema);