// domain/entities/wallet/walletEntity.ts
import { WalletTransactionType } from "../../enum/WalletTransactionType"; 



export interface WalletTransaction {
    _id?: string;
    type: WalletTransactionType;
    amount: number;
    description: string;
    relatedId?: string;
    createdAt?: Date;
}

export interface Wallet {
    _id?: string;
    ownerId: string;
    ownerType: 'user' | 'trainer' | 'admin';
    balance: number;
    transactions: WalletTransaction[];
    createdAt?: Date;
    updatedAt?: Date;
}