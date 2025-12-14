import { VerificationDTO } from '../../../dto/verification/verificationDTO';
import { IGetAllTrainerUseCase } from '../../../useCase/user/trainer/IGetAllTrainers';
import { IUpdateVerification } from '../../../../domain/interfaces/repositories/IVerificationRepository';
import { VerificationMapper } from '../../../mappers/verificationMappers';

export class GetAllTrainerUseCase implements IGetAllTrainerUseCase {
    constructor(
        private _verificationRepository: IUpdateVerification
    ) { }

    async getAllTrainer(page: number, limit: number, search?: string): Promise<{ verifications: VerificationDTO[]; totalVerifications: number; totalPages: number; currentPage: number; }> {
         const skip = (page - 1) * limit;

         const [verifications, totalVerifications] = await Promise.all([
             this._verificationRepository.allVerifiedTrainer(skip, limit,search),
             this._verificationRepository.countVerifiedTrainer(search),
         ]);
 
         const verificationDTOs = verifications.map(verification => VerificationMapper.toDTO(verification.verification, verification.trainer, verification.user));
 
         return {
             verifications: verificationDTOs,
             totalVerifications,
             totalPages: Math.ceil(totalVerifications / limit),
             currentPage: page,
         };

    }
}