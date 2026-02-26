import { Wallet, WalletTransaction } from '../../entities/wallet/walletEntity';

export interface IWalletRepository {
    findByOwnerId(ownerId: string, ownerType: 'user' | 'trainer' | 'admin'): Promise<Wallet | null>;
    createWallet(ownerId: string, ownerType: 'user' | 'trainer' | 'admin'): Promise<Wallet>;
    credit(ownerId: string, ownerType: 'user' | 'trainer' | 'admin', amount: number, transaction: Omit<WalletTransaction, '_id'>): Promise<Wallet>;
    debit(ownerId: string, ownerType: 'user' | 'trainer' | 'admin', amount: number, transaction: Omit<WalletTransaction, '_id'>): Promise<Wallet>;
    getOrCreate(ownerId: string, ownerType: 'user' | 'trainer' | 'admin'): Promise<Wallet>;
}