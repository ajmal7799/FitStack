import { IGetProfileData } from '../../useCase/trainer/IGetProfileData';
import { TrainerProfileDTO } from '../../dto/trainer/trainerProfileDTO';
import { IUserRepository } from '../../../domain/interfaces/repositories/IUserRepository';
import { ITrainerRepository } from '../../../domain/interfaces/repositories/ITrainerRepository';
import { IUpdateVerification } from '../../../domain/interfaces/repositories/IVerificationRepository';
import { NotFoundException } from '../../constants/exceptions';
import { Errors, TRAINER_ERRORS } from '../../../shared/constants/error';
import { TrainerMapper } from '../../mappers/trainerMappers';

export class GetProfileData implements IGetProfileData {
    constructor(
        private _userRepository: IUserRepository,
        private _trainerRepository: ITrainerRepository,
        private _verificationRepository: IUpdateVerification,
    ) {}

    async getProfileData(id: string): Promise<TrainerProfileDTO> {
        const trainer =await this._userRepository.findById(id);
        if (!trainer) {
            throw new NotFoundException(TRAINER_ERRORS.TRAINER_NOT_FOUND);
        }

        const trainerData = await this._trainerRepository.findByTrainerId(id);

        if (!trainerData) {
            throw new NotFoundException(TRAINER_ERRORS.TRAINER_NOT_FOUND);
        }

        const verificationDetails = await this._verificationRepository.findByTrainerId(id);

        if (!verificationDetails) {
            throw new NotFoundException(TRAINER_ERRORS.TRAINER_VERIFICATION_NOT_FOUND);
        }
        return TrainerMapper.toTrainerProfileDTO(trainerData, trainer,verificationDetails);
    }
}