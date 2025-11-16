import { Trainer } from "../../entities/trainer/trainerEntities";
import { IBaseRepository } from "./IBaseRepository";


export interface ITrainerRepository extends IBaseRepository <Trainer>{
    findByEmail(email: string) : Promise<Trainer | null>
}