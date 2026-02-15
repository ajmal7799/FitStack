import { TrainerDetailsResponseDTO } from '../../../dto/user/trainersDTO';

export interface IGetTrainerDetailsUseCase {
    getTrainerDetails(trainerId: string): Promise<TrainerDetailsResponseDTO>;
}