
import { IGetVerificationDetailsPage } from '../../../useCase/admin/verification/IGetVerificationDetailsPage';
import { VerificationDetailDTO } from '../../../dto/verification/verificationDetailsDTO';
import { NotFoundException } from '../../../constants/exceptions';
import { TRAINER_ERRORS } from '../../../../shared/constants/error';
import { IUpdateVerification } from '../../../../domain/interfaces/repositories/IVerificationRepository';
import { VerificationMapper } from '../../../mappers/verificationMappers';
import { IStorageService } from '../../../../domain/interfaces/services/IStorage/IStorageService';

export class GetVerificationDetailsUseCase implements IGetVerificationDetailsPage {
    constructor(
        private _verificationRepository: IUpdateVerification,
        private _storageService: IStorageService,
        
    ) { }

    async execute(trainerId: string): Promise<VerificationDetailDTO> {
        const verification = await this._verificationRepository.findByTrainerId(trainerId);

        if (!verification) {
            throw new NotFoundException(TRAINER_ERRORS.TRAINER_VERIFICATION_NOT_FOUND);
        }
        
        const result = await this._verificationRepository.findVerificationByTrainerId(trainerId);
        
        
        const response: VerificationDetailDTO = VerificationMapper.toDetailDTO(result.verification, result.trainer, result.user);
        response.idCard = await this._storageService.createSignedUrl(response.idCard, 10 * 60);
        response.educationCert = await this._storageService.createSignedUrl(response.educationCert, 10 * 60);
        response.experienceCert = await this._storageService.createSignedUrl(response.experienceCert, 10 * 60);
        return response;
    }
}