import { IGetProfileUseCase } from '../../../useCase/user/profile/IGetProfileUseCase';
import { IUserRepository } from '../../../../domain/interfaces/repositories/IUserRepository';
import { UserMapper } from '../../../mappers/userMappers';
import { NotFoundException } from '../../../constants/exceptions';
import { USER_ERRORS } from '../../../../shared/constants/error';
import { LoginUserDTO } from '../../../dto/auth/LoginUserDTO';
import { IStorageService } from '../../../../domain/interfaces/services/IStorage/IStorageService';

export class GetProfileUseCase implements IGetProfileUseCase {
    constructor(private _userRepository: IUserRepository, private _storageService: IStorageService) {}
    async execute(userId: string): Promise<LoginUserDTO> {
        const user = await this._userRepository.findById(userId);

        if (!user) {
            throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
        }

        const response: LoginUserDTO = UserMapper.toLoginUserResponse(user);
        
        response.profileImage = await this._storageService.createSignedUrl(response.profileImage!, 10 * 60);
        return response;
    }
}
