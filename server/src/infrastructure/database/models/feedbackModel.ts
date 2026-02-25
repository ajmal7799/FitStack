import feedbackSchema from "../schema/feedbackSchema";
import { Document, Model, model, Types } from 'mongoose';


export interface IFeedbackModel extends Document {
    _id: Types.ObjectId;
    sessionId: Types.ObjectId;
    userId: Types.ObjectId;
    trainerId: Types.ObjectId;
    rating: number;
    review?: string;
    createdAt: Date;
    updatedAt: Date;
}
export const feedbackModel = model< IFeedbackModel>('Feedback', feedbackSchema);
