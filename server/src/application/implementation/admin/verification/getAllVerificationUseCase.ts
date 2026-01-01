import { VerificationDTO } from '../../../dto/verification/verificationDTO';
import { IGetAllVerificationUseCase } from '../../../useCase/admin/verification/IGetAllVerificationUseCase';
import { IUpdateVerification } from '../../../../domain/interfaces/repositories/IVerificationRepository';
import { VerificationMapper } from '../../../mappers/verificationMappers';

export class GetAllVerificationUseCase implements IGetAllVerificationUseCase {
    constructor(private _verificationRepository: IUpdateVerification) {}

    async getAllVerification(
        page: number,
        limit: number,
        status?: string,
        search?: string,
    ): Promise<{
    verifications: VerificationDTO[];
    totalVerifications: number;
    totalPages: number;
    currentPage: number;
  }> {
   
        const skip = (page - 1) * limit;
    
        const [verifications, totalVerifications] = await Promise.all([
            this._verificationRepository.findAllVerification(skip, limit, status, search),
            this._verificationRepository.countVerifications(status, search),
        ]);
       
        
        const verificationDTOs = verifications.map(verification =>
            VerificationMapper.toDTO(verification.verification, verification.trainer, verification.user),
        );
    
        return {
            verifications: verificationDTOs,
            totalVerifications,
            totalPages: Math.ceil(totalVerifications / limit),
            currentPage: page,
        };
    }
}
