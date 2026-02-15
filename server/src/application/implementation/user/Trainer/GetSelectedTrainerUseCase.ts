import { TrainerDetailsResponseDTO } from '../../../dto/user/trainersDTO';
import { IGetSelectedTrainer } from '../../../useCase/user/trainer/IGetSelectedTrainer';
import { IUserRepository } from '../../../../domain/interfaces/repositories/IUserRepository';
import { ITrainerSelectRepository } from '../../../../domain/interfaces/repositories/ITrainerSelectRepository';
import { NotFoundException } from '../../../constants/exceptions';
import { USER_ERRORS,TRAINER_ERRORS } from '../../../../shared/constants/error';
import { IStorageService } from '../../../../domain/interfaces/services/IStorage/IStorageService';
import { ITrainerRepository } from '../../../../domain/interfaces/repositories/ITrainerRepository';
import { TrainerMapper } from '../../../mappers/trainerMappers';

export class GetSelectedTrainerUseCase implements IGetSelectedTrainer {
    constructor(
    private _trainerSelectRepository: ITrainerSelectRepository,
    private _userRepository: IUserRepository,
    private _storageService: IStorageService,
    private _trainerRepository: ITrainerRepository,
    ){}

    async getSelectedTrainer(userId: string): Promise<TrainerDetailsResponseDTO> {

        const user = await this._trainerSelectRepository.findByUserId(userId);

        if (!user) {
            throw new NotFoundException(USER_ERRORS.USER_NOT_SELECTED);
        }

        const trainer = await this._userRepository.findById(user.trainerId);

        if (!trainer) {
            throw new NotFoundException(TRAINER_ERRORS.TRAINER_NOT_FOUND);
        }

        const trainerData = await this._trainerRepository.findByTrainerId(user.trainerId);

        if (!trainerData) {
            throw new NotFoundException(TRAINER_ERRORS.TRAINER_NOT_FOUND);
        }

        let profileImageUrl = trainer.profileImage;
        if (trainer.profileImage) {
            profileImageUrl = await this._storageService.createSignedUrl(trainer.profileImage, 300);
        }

        return TrainerMapper.toDTO(trainerData, trainer, profileImageUrl);
    }
}