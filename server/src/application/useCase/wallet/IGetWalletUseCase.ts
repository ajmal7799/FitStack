


import { Wallet } from "../../../domain/entities/wallet/walletEntity";

export interface IGetWalletUseCase {
    execute(ownerId: string, ownerType: 'user' | 'trainer' | 'admin'): Promise<Wallet>;
}