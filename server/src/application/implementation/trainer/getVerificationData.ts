import { IGetVerificationData } from '../../useCase/trainer/IGetVerificationData';
import { TrainerGetVerificationDTO } from '../../dto/trainer/trainerGetVerificationDTO';
import { ITrainerRepository } from '../../../domain/interfaces/repositories/ITrainerRepository';
import { IUserRepository } from '../../../domain/interfaces/repositories/IUserRepository';
import { NotFoundException } from '../../constants/exceptions';
import { IUpdateVerification } from '../../../domain/interfaces/repositories/IVerificationRepository';
import { TRAINER_ERRORS } from '../../../shared/constants/error';
import { VerificationMapper } from '../../mappers/verificationMappers';
import { IStorageService } from '../../../domain/interfaces/services/IStorage/IStorageService';

export class GetVerificationData implements IGetVerificationData {
    constructor(
        private _userRepository: IUserRepository,
        private _verificationRepository: IUpdateVerification,
        private _storageService: IStorageService,
    ) {}
    async getVerificationData(trainerId: string): Promise<any> {
        const trainer = this._userRepository.findById(trainerId);

        if (!trainer) {
            throw new NotFoundException(TRAINER_ERRORS.TRAINER_NOT_FOUND);
        }

        const verificationData = await this._verificationRepository.findByTrainerId(trainerId);

        if (!verificationData) {
            throw new NotFoundException(TRAINER_ERRORS.TRAINER_VERIFICATION_NOT_FOUND);
        }

        const response : TrainerGetVerificationDTO = VerificationMapper.mapToGetVerificationDTO(verificationData);
        response.idCard = await this._storageService.createSignedUrl(response.idCard,10*60);
        response.educationCert = await this._storageService.createSignedUrl(response.educationCert,10*60);
        response.experienceCert = await this._storageService.createSignedUrl(response.experienceCert,10*60);
        return response;

    }
}