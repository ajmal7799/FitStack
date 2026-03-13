// infrastructure/repositories/walletRepository.ts
import { Model } from 'mongoose';
import { IWalletRepository } from '../../domain/interfaces/repositories/IWalletRepository';
import { Wallet, WalletTransaction } from '../../domain/entities/wallet/walletEntity';
import { IWalletModel } from '../database/models/walletModel';
import { WalletMapper } from '../../application/mappers/walletMapper';
import { WalletTransactionType } from '../../domain/enum/WalletTransactionType';
import { CONFIG } from '../config/config';


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

  async credit(
    ownerId: string,
    ownerType: 'user' | 'trainer' | 'admin',
    amount: number,
    transaction: Omit<WalletTransaction, '_id'>
  ): Promise<Wallet> {
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

  async debit(
    ownerId: string,
    ownerType: 'user' | 'trainer' | 'admin',
    amount: number,
    transaction: Omit<WalletTransaction, '_id'>
  ): Promise<Wallet> {
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

  async getAdminPlatformTransactions(
    skip: number,
    limit: number,
    startDate?: Date,
    endDate?: Date,
): Promise<{ transactions: WalletTransaction[]; total: number }> {

    const adminWallet = await this._model.findOne({
        ownerId: CONFIG.ADMIN_ID,
        ownerType: 'admin',
    });

    if (!adminWallet) return { transactions: [], total: 0 };

    let txns = adminWallet.transactions.filter(
        (t) => t.type === WalletTransactionType.PLATFORM_FEE
    );

    if (startDate) {
        txns = txns.filter((t) => t.createdAt && new Date(t.createdAt) >= startDate);
    }
    if (endDate) {
        txns = txns.filter((t) => t.createdAt && new Date(t.createdAt) <= endDate);
    }

    const total = txns.length;

    const paginated = [...txns]
        .sort((a, b) =>
            new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        )
        .slice(skip, skip + limit);

    // ✅ Map to domain entity
    const transactions: WalletTransaction[] = paginated.map((t) => ({
        _id:         t._id?.toString(),
        type:        t.type,
        amount:      t.amount,
        description: t.description,
        relatedId:   t.relatedId?.toString(),
        createdAt:   t.createdAt,
    }));

    return { transactions, total };
}

async getAdminPlatformTransactionStats(): Promise<{
    totalRevenue: number;
    thisMonthRevenue: number;
    totalSessions: number;
    avgPerSession: number;
}> {
    const adminWallet = await this._model.findOne({
        ownerId: CONFIG.ADMIN_ID,
        ownerType: 'admin',
    });

    if (!adminWallet) {
        return { totalRevenue: 0, thisMonthRevenue: 0, totalSessions: 0, avgPerSession: 0 };
    }

    const platformTxns = adminWallet.transactions.filter(
        (t) => t.type === WalletTransactionType.PLATFORM_FEE
    );

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalRevenue    = platformTxns.reduce((sum, t) => sum + t.amount, 0);
    const totalSessions   = platformTxns.length;
    const thisMonthRevenue = platformTxns
        .filter((t) => t.createdAt && new Date(t.createdAt) >= startOfMonth)
        .reduce((sum, t) => sum + t.amount, 0);
    const avgPerSession = totalSessions > 0
        ? parseFloat((totalRevenue / totalSessions).toFixed(2))
        : 0;

    return {
        totalRevenue:     parseFloat(totalRevenue.toFixed(2)),
        thisMonthRevenue: parseFloat(thisMonthRevenue.toFixed(2)),
        totalSessions,
        avgPerSession,
    };
}

  
}
