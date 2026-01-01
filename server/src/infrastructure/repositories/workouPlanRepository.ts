import { IWorkoutPlanRepository } from '../../domain/interfaces/repositories/IWorkoutPlanRepository';
import { WorkoutPlan } from '../../domain/entities/user/workoutPlanEntities';
import { Model } from 'mongoose';
import { BaseRepository } from './baseRepository';
import { WorkoutPlanMapper } from '../../application/mappers/workouPlanMappers';
import { IWorkoutPlanModel } from '../database/models/workoutPlanModel';


export class WorkoutPlanRepository extends BaseRepository<WorkoutPlan, IWorkoutPlanModel> implements IWorkoutPlanRepository {
    constructor(protected _model: Model<IWorkoutPlanModel>) {
        super(_model, WorkoutPlanMapper);
    }

    async saveWorkoutPlan(userId: string, data: Partial<WorkoutPlan>): Promise<WorkoutPlan | null> {
        const updatedDocs = await this._model.findOneAndUpdate({ userId: userId },{ $set: data },{ new: true, upsert: true });
        if (!updatedDocs) return null;
        return WorkoutPlanMapper.fromMongooseDocument(updatedDocs);
    }

    async findByUserId(userId: string): Promise<WorkoutPlan | null> {
        const workoutPlan = await this._model.findOne({ userId: userId });

        if (!workoutPlan) return null;
        return WorkoutPlanMapper.fromMongooseDocument(workoutPlan);
    }
  
}
