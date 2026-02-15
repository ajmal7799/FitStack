import { IGetProfileData } from '../../../useCase/trainer/profile/IGetProfileData';
import { TrainerProfileDTO } from '../../../dto/trainer/profile/trainerProfileDTO';
import { IUserRepository } from '../../../../domain/interfaces/repositories/IUserRepository';
import { ITrainerRepository } from '../../../../domain/interfaces/repositories/ITrainerRepository';
import { IUpdateVerification } from '../../../../domain/interfaces/repositories/IVerificationRepository';
import { NotFoundException } from '../../../constants/exceptions';
import { Errors, TRAINER_ERRORS } from '../../../../shared/constants/error';
import { TrainerMapper } from '../../../mappers/trainerMappers';
import { IStorageService } from '../../../../domain/interfaces/services/IStorage/IStorageService';

export class GetProfileData implements IGetProfileData {
    constructor(
        private _userRepository: IUserRepository,
        private _trainerRepository: ITrainerRepository,
        private _verificationRepository: IUpdateVerification,
        private _storageService: IStorageService,
    ) {}

    async getProfileData(id: string): Promise<TrainerProfileDTO> {
        const trainer = await this._userRepository.findById(id);
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
        const reponse : TrainerProfileDTO = TrainerMapper.toTrainerProfileDTO(trainerData, trainer,verificationDetails);
        reponse.profileImage = await this._storageService.createSignedUrl(reponse.profileImage!, 10*60);
        return reponse;
    }
}