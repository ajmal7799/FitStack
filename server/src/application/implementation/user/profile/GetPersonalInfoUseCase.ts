import { IGetPersonalInfoUseCase } from '../../../useCase/user/profile/IGetPersonalInfoUseCase';
import { IUserRepository } from '../../../../domain/interfaces/repositories/IUserRepository';
import { IStorageService } from '../../../../domain/interfaces/services/IStorage/IStorageService';
import { IUserProfileRepository } from '../../../../domain/interfaces/repositories/IUserProfileRepository';
import { userProfileGetVerficationDTO } from '../../../dto/user/createUserProfileDTO';
import { NotFoundException } from '../../../constants/exceptions';
import { USER_ERRORS } from '../../../../shared/constants/error';
import { UserProfileMapper } from '../../../mappers/userProfileMapper';

export class GetPersonalInfoUseCase implements IGetPersonalInfoUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _userProfileRepository: IUserProfileRepository,
    private _storageService: IStorageService
  ) {}

  async execute(userId: string): Promise<userProfileGetVerficationDTO> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
    }

    const userProfile = await this._userProfileRepository.findByUserId(userId);

    if (!userProfile) {
      throw new NotFoundException(USER_ERRORS.USER_PROFILE_NOT_FOUND);
    }

    const response:userProfileGetVerficationDTO = UserProfileMapper.mapToGetUserProfileDTO(userProfile);
    response.profileImage = await this._storageService.createSignedUrl(response.profileImage!, 10*60);
    return response

  }
}
