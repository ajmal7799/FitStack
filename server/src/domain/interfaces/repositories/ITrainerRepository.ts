import { Trainer } from "../../entities/trainer/trainerEntities";
import { IBaseRepository } from "./IBaseRepository";
import { User } from "../../entities/user/userEntities";


export interface ITrainerRepository extends IBaseRepository <Trainer>{
    findByEmail(email: string) : Promise<Trainer | null>
    // findAllTrainer(skip?: number, limit?: number, status?: string, search?: string): Promise<User[]>;
}