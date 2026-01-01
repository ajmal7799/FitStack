import {
  UpdateTrainerProfileDTO,
  UpdateTrainerProfileResponseDTO,
} from '../../../dto/trainer/profile/updateTrainerProfileDTO';
import { IUpdateTrainerProfileUseCase } from '../../../useCase/trainer/profile/IUpdateProfileUseCase';
import { IUserRepository } from '../../../../domain/interfaces/repositories/IUserRepository';
import { ITrainerRepository } from '../../../../domain/interfaces/repositories/ITrainerRepository';
import { IStorageService } from '../../../../domain/interfaces/services/IStorage/IStorageService';
import { NotFoundException,AlreadyExisitingExecption } from '../../../constants/exceptions';
import { TRAINER_ERRORS, USER_ERRORS } from '../../../../shared/constants/error';
import { StorageFolderNameEnums } from '../../../../domain/enum/storageFolderNameEnums';
import { User } from '../../../../domain/entities/user/userEntities';
import { Trainer } from '../../../../domain/entities/trainer/trainerEntities';
import { is } from 'zod/locales';

export class UpdateTrainerProfileUseCase implements IUpdateTrainerProfileUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _trainerRepository: ITrainerRepository,
    private _storageService: IStorageService
  ) {}

  async updateTrainerProfile(id: string, data: UpdateTrainerProfileDTO): Promise<UpdateTrainerProfileResponseDTO> {
    const user = await this._userRepository.findById(id);

    if (!user) throw new NotFoundException(TRAINER_ERRORS.TRAINER_NOT_FOUND);

    const trainer = await this._trainerRepository.findByTrainerId(id);

    if (!trainer) throw new NotFoundException(TRAINER_ERRORS.TRAINER_PROFILE_DATA_NOT_FOUND);

    if (data.email && data.email !== user.email) {
        const existingUser = await this._userRepository.findByEmail(data.email);
        if (existingUser) throw new AlreadyExisitingExecption(USER_ERRORS.USER_ALREADY_EXISTS);
    }

    let profileImageUrl: string | undefined;

    if (data.profileImage) {
      profileImageUrl = await this._storageService.upload(
        data.profileImage,
        StorageFolderNameEnums.TRAINER_PROFILE_IMAGE + '/' + id + Date.now()
      );
      await this._userRepository.updateUserProfileImage(id, profileImageUrl);
    }

    

    const userProfileData: User = {
      name: data.name || user.name,
      email: data.email || user.email,
      phone: data.phone || user.phone,
      role: user.role,
      isActive: user.isActive,
      profileImage: profileImageUrl || user.profileImage,
    };

    const trainerProfileData: Trainer = {
      id: trainer.id,
      trainerId: trainer.trainerId,
      qualification: data.qualification || trainer.qualification,
      specialisation: data.specialisation || trainer.specialisation,
      experience: data.experience || trainer.experience,
      about: data.about || trainer.about,
      isVerified: trainer.isVerified,
    };

    const updateUser = await this._userRepository.updateTrainerProfile(id, userProfileData);

    const updateTrainer = await this._trainerRepository.updateTrainerProfile(trainer.id, trainerProfileData);

    return { user: updateUser, trainer: updateTrainer } as UpdateTrainerProfileResponseDTO;
  }
}
