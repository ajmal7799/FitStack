import { SubmitTrainerVerificationRequest } from '../../dto/trainer/trainerDTO';
import { TrainerVerificationResponse } from '../../dto/trainer/trainerDTO';
import { IUpdateTrainers } from '../../useCase/trainer/IUpdateTrainers';
import { NotFoundException } from '../../constants/exceptions';
import { Errors,TRAINER_ERRORS } from '../../../shared/constants/error';
import { UserRepository } from '../../../infrastructure/repositories/userRepository';
import { IStorageService } from '../../../domain/interfaces/services/IStorage/IStorageService';
import { StorageFolderNameEnums } from '../../../domain/enum/storageFolderNameEnums';
import { ITrainerRepository } from '../../../domain/interfaces/repositories/ITrainerRepository';
import { IUpdateVerification } from '../../../domain/interfaces/repositories/IVerificationRepository';
import { VerificationStatus } from '../../../domain/enum/verificationStatus';


export class UpdateTrainer implements IUpdateTrainers {
    constructor(
    private _userRepository: UserRepository,
    private _storageService: IStorageService,
    private _trainerRepository: ITrainerRepository,
    private _verificationRepository: IUpdateVerification,
    ) {}

    async updateTrainerProfile(data: SubmitTrainerVerificationRequest): Promise<TrainerVerificationResponse> {
        const { trainerId, qualification, specialisation, experience, about, idCard, educationCert, experienceCert } = data;

        const trainer = await this._userRepository.findById(trainerId);

        if (!trainer) {
            throw new NotFoundException(TRAINER_ERRORS.TRAINER_NOT_FOUND);
        }

        const idCardUrl = await this._storageService.upload(
            idCard,
            StorageFolderNameEnums.IDENTITY_VERIFICATION + '/' + trainerId + Date.now(),
        );

        const educationCertUrl = await this._storageService.upload(
            educationCert,
            StorageFolderNameEnums.EDUCATION_CERTIFICATES + '/' + trainerId + Date.now(),
        );

        const experienceCertUrl = await this._storageService.upload(
            experienceCert,
            StorageFolderNameEnums.EXPERIENCE_CERTIFICATES + '/' + trainerId + Date.now(),
        );

        const updatedTrainer = await this._trainerRepository.profileCompletion(trainerId,{
            qualification,
            specialisation,
            experience,
            about,
            isVerified: true,
        });
    
        const updatedVerification = await this._verificationRepository.updateTrainerVerification(trainerId,{
            idCard: idCardUrl,
            educationCert: educationCertUrl,
            experienceCert: experienceCertUrl,
            verificationStatus: VerificationStatus.PENDING,
            submittedAt: new Date(),
        });

        return {
            trainer: updatedTrainer,
            verification: updatedVerification,
        } as TrainerVerificationResponse;

    }
}
