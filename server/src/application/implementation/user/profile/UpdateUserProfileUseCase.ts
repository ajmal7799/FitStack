import { User } from '../../../../domain/entities/user/userEntities';
import { updateUserProfileRequest } from '../../../dto/user/profile/updateUserProfileDTO';
import { IUpdateUserProfileUseCase } from '../../../useCase/user/profile/IUpdateUserProfileUseCase';
import { IUserRepository } from '../../../../domain/interfaces/repositories/IUserRepository';
import { IStorageService } from '../../../../domain/interfaces/services/IStorage/IStorageService';
import { NotFoundException, AlreadyExisitingExecption } from '../../../constants/exceptions';
import { USER_ERRORS } from '../../../../shared/constants/error';
import { StorageFolderNameEnums } from '../../../../domain/enum/storageFolderNameEnums';
export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {
    constructor(private _userRepository: IUserRepository, private _storageService: IStorageService) {}

    async execute(userId: string, data: updateUserProfileRequest): Promise<User | null> {
        const user = await this._userRepository.findById(userId);

        if (!user) {
            throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
        }
        if (data.email && data.email !== user.email) {
            const existingUser = await this._userRepository.findByEmail(data.email);
            if (existingUser) throw new AlreadyExisitingExecption(USER_ERRORS.USER_ALREADY_EXISTS);
        }

        let profileImageUrl: string | undefined;

        if (data.profileImage) {
            profileImageUrl = await this._storageService.upload(
                data.profileImage,
                StorageFolderNameEnums.USER_PROFILE_IMAGE + '/' + userId + Date.now(),
            );
            await this._userRepository.updateUserProfileImage(userId, profileImageUrl);
        }

        const userProfileData: User = {
            name: data.name || user.name,
            email: data.email || user.email,
            phone: data.phone || user.phone,
            role: user.role,
            isActive: user.isActive,
            profileImage: profileImageUrl || user.profileImage,
        };

        return await this._userRepository.updateTrainerProfile(userId, userProfileData);
    }
}
