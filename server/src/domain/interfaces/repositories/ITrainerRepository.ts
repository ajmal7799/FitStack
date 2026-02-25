import { Trainer } from '../../entities/trainer/trainerEntities';
import { IBaseRepository } from './IBaseRepository';
import { User } from '../../entities/user/userEntities';


export interface ITrainerRepository extends IBaseRepository <Trainer>{
    findByTrainerId(trainerId: string) : Promise<Trainer| null>;
    profileCompletion(trainerId: string, data: Partial<Trainer>): Promise<Trainer | null>;
    updateTrainerProfile(trainerId: string, profile: Trainer): Promise<Trainer | null>;
    updateRatingMetrics(id: string, metrics: {
        ratingSum: number; 
        ratingCount: number; 
        averageRating: number 
    }): Promise<void>;
    
   
}