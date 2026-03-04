import { IUserRepository } from '../../../../domain/interfaces/repositories/IUserRepository';
import { UserDTO } from '../../../dto/user/userDTO';
import { UserMapper } from '../../../mappers/userMappers';
import { IGetAllTrainerUseCase } from '../../../useCase/admin/trainer/IGetAllTrainerUseCase';
import { IStorageService } from '../../../../domain/interfaces/services/IStorage/IStorageService';
import { ITrainerRepository } from '../../../../domain/interfaces/repositories/ITrainerRepository';

export class GetAllTrainerUseCase implements IGetAllTrainerUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _storageService: IStorageService,
        private _trainerRepository: ITrainerRepository,
    ) {}

    async getAllTrainer(
        page: number,
        limit: number,
        status?: string,
        search?: string,
    ): Promise<{ users: UserDTO[]; totalUsers: number; totalPages: number; currentPage: number }> {
        const skip = (page - 1) * limit;

        const [users, totalUsers] = await Promise.all([
            this._userRepository.findAllTrainer(skip, limit, status, search),
            this._userRepository.countTrainer(status, search),
        ]);

        const userDTOs = await Promise.all(
            users.map(async(user) => {
                const dto = UserMapper.toDTO(user);

                // ✅ Get presigned profile image URL
                if (user.profileImage) {
                    dto.profileImage = await this._storageService.createSignedUrl(user.profileImage, 10 * 60);
                }

                // ✅ Get average rating from trainer profile
                const trainerProfile = await this._trainerRepository.findByTrainerId(user._id!.toString());
                if (trainerProfile) {
                    dto.averageRating = trainerProfile.averageRating ?? 0;
                }

                return dto;
            }),
        );

        return {
            users: userDTOs,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
        };
    }
}