import { ITrainerSelectUseCase } from '../../../useCase/user/trainer/ITrainerSelectUseCase';
import { ITrainerSelectRepository } from '../../../../domain/interfaces/repositories/ITrainerSelectRepository';
import { IUserRepository } from '../../../../domain/interfaces/repositories/IUserRepository';
import { AlreadyExisitingExecption, NotFoundException } from '../../../constants/exceptions';
import { TRAINER_ERRORS, USER_ERRORS } from '../../../../shared/constants/error';
import { TrainerSelectMapper } from '../../../mappers/trainerSelectMappers';



export class TrainerSelectUseCase implements ITrainerSelectUseCase {
    constructor(private _trainerSelectRepository: ITrainerSelectRepository, private _userRepository: IUserRepository) {}

    async selectTrainer(userId: string, trainerId: string): Promise<void> {
        const trainer = await this._userRepository.findById(trainerId);

        if (!trainer) {
            throw new NotFoundException(TRAINER_ERRORS.TRAINER_NOT_FOUND);
        }

        const existingSelection = await this._trainerSelectRepository.findByUserId(userId);

        if (existingSelection) {
            throw new AlreadyExisitingExecption(USER_ERRORS.TRAINER_ALREADY_SELECTED);
        }
        
        const trainerSelectionEntities = TrainerSelectMapper.toEntity(userId, trainerId);

        await this._trainerSelectRepository.save(trainerSelectionEntities);
    }
}

