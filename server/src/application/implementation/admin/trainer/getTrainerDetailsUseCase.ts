import { ITrainerDetailsUseCase } from '../../../useCase/admin/trainer/ITrainerDetailsUseCase';
import { IUserRepository } from '../../../../domain/interfaces/repositories/IUserRepository';
import { ITrainerRepository } from '../../../../domain/interfaces/repositories/ITrainerRepository';
import { IWalletRepository } from '../../../../domain/interfaces/repositories/IWalletRepository';
import { IVideoCallRepository } from '../../../../domain/interfaces/repositories/IVideoCallRepository';
import { IStorageService } from '../../../../domain/interfaces/services/IStorage/IStorageService';
import { NotFoundException } from '../../../constants/exceptions';
import { ITrainerSelectRepository } from '../../../../domain/interfaces/repositories/ITrainerSelectRepository';
import { TrainerDetailsAdminDTO } from '../../../dto/admin/subscription/TrainerDetailsDTO';

export class GetTrainerDetailsUseCase implements ITrainerDetailsUseCase {
    constructor(
        private _trainerRepository: ITrainerRepository,
        private _userRepository: IUserRepository,
        private _walletRepository: IWalletRepository,
        private _storageService: IStorageService,
        private _trainerSelectRepository: ITrainerSelectRepository,

    ) { }

    async getTrainerDetails(trainerId: string): Promise<TrainerDetailsAdminDTO> {
        const user = await this._userRepository.findById(trainerId);
        if (!user) throw new NotFoundException('Trainer not found');

        // 2. Get trainer profile
        const trainerProfile = await this._trainerRepository.findByTrainerId(trainerId);
        if (!trainerProfile) throw new NotFoundException('Trainer profile not found');

        // 3. Get presigned profile image
        let profileImage: string | undefined;
        if (user.profileImage) {
            profileImage = await this._storageService.createSignedUrl(user.profileImage, 10 * 60);
        }

        // 4. Get total earnings from wallet
        const wallet = await this._walletRepository.findByOwnerId(trainerId, 'trainer');
        const totalEarnings = wallet?.balance ?? 0;

        const totalClients = await this._trainerSelectRepository.countByTrainerId(trainerId);
        return {
            _id: user._id!.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone!,
            profileImage,
            isActive: user.isActive,
            qualification: trainerProfile.qualification,
            specialisation: trainerProfile.specialisation,
            experience: trainerProfile.experience,
            about: trainerProfile.about,
            isVerified: trainerProfile.isVerified,
            averageRating: trainerProfile.averageRating ?? 0,
            ratingCount: trainerProfile.ratingCount ?? 0,
            totalEarnings,
            totalClients,
        };
        
    }

}    