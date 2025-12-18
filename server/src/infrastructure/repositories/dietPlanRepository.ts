import { Model } from 'mongoose';
import { BaseRepository } from "./baseRepository";
import { DietPlan } from '../../domain/entities/user/dietPlanEntities';
import { IDietPlanRepository } from '../../domain/interfaces/repositories/IDietPlanRepository';
import { IDietPlanModel } from '../database/models/dietPlanModel';
import { DietPlanMapper } from '../../application/mappers/dietPlanMappers';


export class DietPlanRepository extends BaseRepository<DietPlan, IDietPlanModel> implements IDietPlanRepository {
    constructor(protected _model: Model<IDietPlanModel>) {
        super(_model, DietPlanMapper);
    }

    async saveDietPlan(userId: string, data: Partial<DietPlan>): Promise<DietPlan | null> {
        const updatedDocs = await this._model.findOneAndUpdate({userId: userId},{$set: data},{new: true, upsert: true});
        if (!updatedDocs) return null;
        return DietPlanMapper.fromMongooseDocument(updatedDocs);
    }

    async findByUserId(userId: string): Promise<DietPlan | null> {
        const updatedDocs = await this._model.findOne({userId: userId});
        if (!updatedDocs) return null;
        return DietPlanMapper.fromMongooseDocument(updatedDocs);
    }
}