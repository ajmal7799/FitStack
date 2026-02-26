import { IGetWalletUseCase } from "../../useCase/wallet/IGetWalletUseCase";
import { IWalletRepository } from "../../../domain/interfaces/repositories/IWalletRepository";
import { Wallet } from "../../../domain/entities/wallet/walletEntity";

export class GetWalletUseCase implements IGetWalletUseCase {
    constructor(private _walletRepository: IWalletRepository) {}
    async execute(ownerId: string, ownerType: 'user' | 'trainer' | 'admin'): Promise<Wallet> {
        return await this._walletRepository.getOrCreate(ownerId, ownerType);
    }
}