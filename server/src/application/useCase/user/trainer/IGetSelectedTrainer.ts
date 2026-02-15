import { TrainerDetailsResponseDTO } from '../../../dto/user/trainersDTO';

export interface IGetSelectedTrainer {
    getSelectedTrainer(userId: string): Promise<TrainerDetailsResponseDTO>;
}