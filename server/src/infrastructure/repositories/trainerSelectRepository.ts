import { TrainerSelection } from "../../domain/entities/trainer/trainerSelectionEntities";
import { ITrainerSelectRepository } from "../../domain/interfaces/repositories/ITrainerSelectRepository";
import { BaseRepository } from "./baseRepository";
import { ITrainerSelectModel } from "../database/models/trainerSelectModel";
import { Model } from "mongoose";
import { TrainerSelectMapper } from "../../application/mappers/trainerSelectMappers";

export class TrainerSelectRepository extends BaseRepository<TrainerSelection, ITrainerSelectModel> implements ITrainerSelectRepository {
    constructor(protected _model: Model<ITrainerSelectModel>) {
        super(_model, TrainerSelectMapper);
    }

   async findByUserId(userId: string): Promise<TrainerSelection | null> {
        const found = await this._model.findOne({ userId: userId });
        if (!found) return null;
        return TrainerSelectMapper.fromMongooseDocument(found);
    }

}