import { ITrainerRepository } from "../../../../domain/interfaces/repositories/ITrainerRepository";
import { IKeyValueTTLCaching } from "../../../../domain/interfaces/services/ICache/IKeyValueTTLCaching";
import { ICreateTrainerUseCase } from "../../../useCase/auth/trainer/ICreateTrainerUseCase";
import { TRAINER_ERRORS } from "../../../../shared/constants/error";

export class RegisterTrianerUseCase implements ICreateTrainerUseCase {
    constructor (private _trainerRepository: ITrainerRepository, private _cacheStorage: IKeyValueTTLCaching) {}

    async createTrainer(email: string): Promise<void> {
        const existingTrainer = await this._trainerRepository.findByEmail(email)
        if(existingTrainer) {
            throw new Error(TRAINER_ERRORS.TRAINER_ALREADY_EXISTS)
        }

        
    }
}