// infrastructure/repositories/walletRepository.ts
import { Model } from 'mongoose';
import { IWalletRepository } from '../../domain/interfaces/repositories/IWalletRepository';
import { Wallet, WalletTransaction } from '../../domain/entities/wallet/walletEntity';
import { IWalletModel } from '../database/models/walletModel';
import { WalletMapper } from '../../application/mappers/walletMapper';


export class WalletRepository implements IWalletRepository {
    constructor(private _model: Model<IWalletModel>) {}

    async findByOwnerId(ownerId: string, ownerType: 'user' | 'trainer' | 'admin'): Promise<Wallet | null> {
        const doc = await this._model.findOne({ ownerId, ownerType });
        return doc ? WalletMapper.fromMongooseDocument(doc) : null;
    }

    async createWallet(ownerId: string, ownerType: 'user' | 'trainer' | 'admin'): Promise<Wallet> {
        const doc = await this._model.create({ ownerId, ownerType, balance: 0, transactions: [] });
        return WalletMapper.fromMongooseDocument(doc);
    }

    async getOrCreate(ownerId: string, ownerType: 'user' | 'trainer' | 'admin'): Promise<Wallet> {
        const existing = await this.findByOwnerId(ownerId, ownerType);
        if (existing) return existing;
        return this.createWallet(ownerId, ownerType);
    }

    async credit(ownerId: string, ownerType: 'user' | 'trainer' | 'admin', amount: number, transaction: Omit<WalletTransaction, '_id'>): Promise<Wallet> {
        const doc = await this._model.findOneAndUpdate(
            { ownerId, ownerType },
            {
                $inc: { balance: amount },
                $push: { transactions: { ...transaction, createdAt: new Date() } },
            },
            { new: true, upsert: true }
        );
        return WalletMapper.fromMongooseDocument(doc!);
    }

    async debit(ownerId: string, ownerType: 'user' | 'trainer' | 'admin', amount: number, transaction: Omit<WalletTransaction, '_id'>): Promise<Wallet> {
        const doc = await this._model.findOneAndUpdate(
            { ownerId, ownerType },
            {
                $inc: { balance: -amount },
                $push: { transactions: { ...transaction, createdAt: new Date() } },
            },
            { new: true, upsert: true }
        );
        return WalletMapper.fromMongooseDocument(doc!);
    }
}