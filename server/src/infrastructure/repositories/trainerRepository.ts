import { ITrainerRepository } from '../../domain/interfaces/repositories/ITrainerRepository';
import { BaseRepository } from './baseRepository';
import { Trainer } from '../../domain/entities/trainer/trainerEntities';
import { ITrainerModel } from '../database/models/trainerModel';
import { Model, PipelineStage } from 'mongoose';
import { TrainerMapper } from '../../application/mappers/trainerMappers';
import { TrainerVerification } from '../../domain/entities/trainer/verification';
import { User } from '../../domain/entities/user/userEntities';


export class TrainerRepository extends BaseRepository<Trainer, ITrainerModel> implements ITrainerRepository {
    constructor(protected _model: Model<ITrainerModel>) {
        super(_model, TrainerMapper);
    // Initialization code here
    }

    async profileCompletion(trainerId: string, data: Partial<Trainer>): Promise<Trainer | null> {
        const updatedDoc = await this._model.findOneAndUpdate(
            { trainerId: trainerId },
            { $set: data },
            { new: true, upsert: true },
        );

        if (!updatedDoc) return null;
        return TrainerMapper.fromMongooseDocument(updatedDoc);
    }

    async findByTrainerId(trainerId: string): Promise<Trainer | null> {
        const trainerDoc = await this._model.findOne({ trainerId: trainerId });
        if (!trainerDoc) {
            return null;
        }
        return TrainerMapper.fromMongooseDocument(trainerDoc);
    }

    async updateTrainerProfile(trainerId: string, profile: Trainer): Promise<Trainer | null> {
        const updatedDoc = await this._model.findOneAndUpdate(
            { _id: trainerId },
            { $set: profile },
            { new: true, upsert: true },
        );

        if (!updatedDoc) return null;
        return TrainerMapper.fromMongooseDocument(updatedDoc);
    }

   async updateRatingMetrics(id: string, metrics: { ratingSum: number; ratingCount: number; averageRating: number; }): Promise<void> {
       await this._model.findByIdAndUpdate(id,{
            $set: {
                ratingSum: metrics.ratingSum,
                ratingCount: metrics.ratingCount,
                averageRating: metrics.averageRating
            }
        });
    }
}
