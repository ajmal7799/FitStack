import { IBaseRepository } from "./IBaseRepository";
import { TrainerSelection } from "../../entities/trainer/trainerSelectionEntities";
export interface ITrainerSelectRepository extends IBaseRepository<TrainerSelection> {
    findByUserId(userId: string): Promise<TrainerSelection | null>;
}

