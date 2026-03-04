import { VerificationDTO } from '../../../dto/verification/verificationDTO';
import { IGetAllVerificationUseCase } from '../../../useCase/admin/verification/IGetAllVerificationUseCase';
import { IUpdateVerification } from '../../../../domain/interfaces/repositories/IVerificationRepository';
import { VerificationMapper } from '../../../mappers/verificationMappers';
import { IStorageService } from '../../../../domain/interfaces/services/IStorage/IStorageService';

export class GetAllVerificationUseCase implements IGetAllVerificationUseCase {
    constructor(private _verificationRepository: IUpdateVerification, private _storageService: IStorageService) {}

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
       
        
        const verificationDTOs = await Promise.all(
            verifications.map(async(verification) => {
                let profileImage: string | undefined;

                if (verification.user.profileImage) {
                    profileImage = await this._storageService.createSignedUrl(
                        verification.user.profileImage,
                        10 * 60,
                    );
                }

                return VerificationMapper.toDTO(
                    verification.verification,
                    verification.trainer,
                    verification.user,
                    profileImage, // ✅ now passing it
                );
            }),
        );
    
        return {
            verifications: verificationDTOs,
            totalVerifications,
            totalPages: Math.ceil(totalVerifications / limit),
            currentPage: page,
        };
    }
}
