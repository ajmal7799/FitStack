import { IFeedbackRepository } from "../../domain/interfaces/repositories/IFeedbackRepository";
import { Feedback } from "../../domain/entities/Feedback/feedbackEntity";
import { FeedbackMapper } from "../../application/mappers/feedbackMappers";
import { BaseRepository } from "./baseRepository";
import { IFeedbackModel } from "../database/models/feedbackModel";
import { Model } from "mongoose";

export class FeedbackRepository extends BaseRepository<Feedback, IFeedbackModel> implements IFeedbackRepository  {
    constructor(protected _model : Model<IFeedbackModel>) {
        super(_model, FeedbackMapper);
    }

   async findBySessionId(sessionId: string): Promise<Feedback | null> {
        const feedback = await this._model.findOne({ sessionId });
        return feedback ? FeedbackMapper.fromMongooseDocument(feedback) : null;
    }
}
