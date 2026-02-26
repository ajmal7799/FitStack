import { Wallet, WalletTransaction } from '../../domain/entities/wallet/walletEntity';
import { IWalletModel, IWalletTransactionModel } from '../../infrastructure/database/models/walletModel';

export class WalletMapper {
    static fromMongooseDocument(doc: IWalletModel): Wallet {
        return {
            _id: doc._id.toString(),
            ownerId: doc.ownerId.toString(),
            ownerType: doc.ownerType,
            balance: doc.balance,
            transactions: doc.transactions.map((t: IWalletTransactionModel) => ({
                _id: t._id.toString(),
                type: t.type,
                amount: t.amount,
                description: t.description,
                relatedId: t.relatedId?.toString(),
                createdAt: t.createdAt,
            })),
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
}