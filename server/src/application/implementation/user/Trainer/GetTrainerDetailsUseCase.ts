import { IGetTrainerDetailsUseCase } from '../../../useCase/user/trainer/IGetTrainerDetailsUseCase';
import { ITrainerRepository } from '../../../../domain/interfaces/repositories/ITrainerRepository';
import { NotFoundException } from '../../../constants/exceptions';
import { TRAINER_ERRORS } from '../../../../shared/constants/error';
import { IUserRepository } from '../../../../domain/interfaces/repositories/IUserRepository';
import { TrainerDetailsResponseDTO } from '../../../dto/user/trainersDTO';
import { TrainerMapper } from '../../../mappers/trainerMappers';
import { IStorageService } from '../../../../domain/interfaces/services/IStorage/IStorageService';

export class GetTrainerDetailsUseCase implements IGetTrainerDetailsUseCase {
    constructor(
    private _trainerRepository: ITrainerRepository,
    private _userRepository: IUserRepository,
    private _storageService: IStorageService,
    ) {}

    async getTrainerDetails(trainerId: string): Promise<TrainerDetailsResponseDTO> {
    
        const [user, trainer] = await Promise.all([
            this._userRepository.findById(trainerId),
            this._trainerRepository.findByTrainerId(trainerId),
        ]);

        if (!user) {
            throw new NotFoundException(TRAINER_ERRORS.TRAINER_NOT_FOUND);
        }

        if (!trainer) {
            throw new NotFoundException(TRAINER_ERRORS.TRAINER_PROFILE_DATA_NOT_FOUND);
        }

        let profileImageUrl = user.profileImage;
        if (user.profileImage) {
            profileImageUrl = await this._storageService.createSignedUrl(user.profileImage, 300);
        }

        return TrainerMapper.toDTO(trainer, user, profileImageUrl);
    }
}
