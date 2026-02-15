import { VerificationDTO } from '../../../dto/verification/verificationDTO';
import { IGetAllTrainerUseCase } from '../../../useCase/user/trainer/IGetAllTrainers';
import { IUpdateVerification } from '../../../../domain/interfaces/repositories/IVerificationRepository';
import { VerificationMapper } from '../../../mappers/verificationMappers';
import { IStorageService } from '../../../../domain/interfaces/services/IStorage/IStorageService';
import { IUserRepository } from '../../../../domain/interfaces/repositories/IUserRepository';

export class GetAllTrainerUseCase implements IGetAllTrainerUseCase {
    constructor(
        private _verificationRepository: IUpdateVerification,
        private _storageService: IStorageService,
        private _userRepository: IUserRepository,
    ) { }

    async getAllTrainer(page: number, limit: number, search?: string, userId?: string): Promise<{ verifications: VerificationDTO[]; totalVerifications: number; totalPages: number; currentPage: number; hasActiveSubscription: boolean }> {
        const user = await this._userRepository.findById(userId!);
        const skip = (page - 1) * limit;

        const [verifications, totalVerifications] = await Promise.all([
            this._verificationRepository.allVerifiedTrainer(skip, limit,search),
            this._verificationRepository.countVerifiedTrainer(search),
        ]);
        
        
        
        const verificationDTOs = await Promise.all(
            verifications.map(async(verification) => {
                let profileImageUrl = verification.user.profileImage;
                if (profileImageUrl) {
                    profileImageUrl = await this._storageService.createSignedUrl(profileImageUrl, 60 * 5);
                }
                return VerificationMapper.toDTO(verification.verification, verification.trainer, verification.user, profileImageUrl);
            }),
        );
        let hasActiveSubscription: boolean = false;

     hasActiveSubscription = user ? user.activeMembershipId ? true : false : false;

         
        return {
            verifications: verificationDTOs,
            totalVerifications,
            totalPages: Math.ceil(totalVerifications / limit),
            currentPage: page,
            hasActiveSubscription
        };

    }
}