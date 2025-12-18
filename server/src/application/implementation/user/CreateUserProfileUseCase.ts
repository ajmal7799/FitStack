import { ICreateUserProfileUseCase } from '../../useCase/user/ICreateUserProfileUseCase';
import { UserProfile } from '../../../domain/entities/user/userProfile';
import { createUserProfileRequest, createUserProfileResponse } from '../../dto/user/createUserProfileDTO';
import { IUserRepository } from '../../../domain/interfaces/repositories/IUserRepository';
import { NotFoundException } from '../../constants/exceptions';
import { USER_ERRORS } from '../../../shared/constants/error';
import { IStorageService } from '../../../domain/interfaces/services/IStorage/IStorageService';
import { StorageFolderNameEnums } from '../../../domain/enum/storageFolderNameEnums';
import { IUserProfileRepository } from '../../../domain/interfaces/repositories/IUserProfileRepository';

export class CreateUserProfileUseCase implements ICreateUserProfileUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _storageService: IStorageService,
    private _userProfileRepository: IUserProfileRepository
  ) {}

  async createUserProfile(data: createUserProfileRequest): Promise<createUserProfileResponse> {
    const {
      userId,
      age,
      gender,
      height,
      weight,
      fitnessGoal,
      targetWeight,
      experienceLevel,
      workoutLocation,
      dietPreference,
      preferredWorkoutTypes,
      medicalConditions,
      profileImage,
    } = data;

    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
    }
   
    let profileImageUrl: string | undefined;

    if (profileImage) {
      profileImageUrl = await this._storageService.upload(
        profileImage,
        StorageFolderNameEnums.USER_PROFILE_IMAGE + '/' + userId + Date.now()
      );
    }

    const updateUserProfile = await this._userProfileRepository.createUserProfile(userId, {
      age,
      gender,
      height,
      weight,
      fitnessGoal,
      targetWeight,
      experienceLevel,
      workoutLocation,
      dietPreference,
      preferredWorkoutTypes,
      medicalConditions,
      profileImage: profileImageUrl,
      profileCompleted: true,
    });

    return {
      userProfile: updateUserProfile,
    } as createUserProfileResponse;
  }
}
