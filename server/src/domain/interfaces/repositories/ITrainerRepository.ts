import { Trainer } from '../../entities/trainer/trainerEntities';
import { IBaseRepository } from './IBaseRepository';
import { User } from '../../entities/user/userEntities';


export interface ITrainerRepository extends IBaseRepository <Trainer>{
    findByTrainerId(trainerId: string) : Promise<Trainer| null>;
    profileCompletion(trainerId: string, data: Partial<Trainer>): Promise<Trainer | null>;
   
}