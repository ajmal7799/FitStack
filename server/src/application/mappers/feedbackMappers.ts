import mongoose, { Mongoose } from 'mongoose';
import { Feedback } from "../../domain/entities/Feedback/feedbackEntity";
import { IFeedbackModel } from '../../infrastructure/database/models/feedbackModel';
import { CreateFeedbackDto } from '../dto/feedback/createFeedback';


export class FeedbackMapper {
    static toMongooseDocument(feedback: Feedback) {
        return {
            _id: new mongoose.Types.ObjectId(feedback._id),
            sessionId: new mongoose.Types.ObjectId(feedback.sessionId),
            userId: new mongoose.Types.ObjectId(feedback.userId),
            trainerId: new mongoose.Types.ObjectId(feedback.trainerId),
            rating: feedback.rating,
            review: feedback.review
        }
    }

    static fromMongooseDocument(feedback: IFeedbackModel): Feedback {
        return {
            _id: feedback._id.toString(),
            sessionId: feedback.sessionId.toString(),
            userId: feedback.userId.toString(),
            trainerId: feedback.trainerId.toString(),
            rating: feedback.rating,
            review: feedback.review,
            createdAt: feedback.createdAt
        };
    }

    static toEntity(feedback: CreateFeedbackDto): Feedback {
        return {
            _id: new mongoose.Types.ObjectId().toString(),
            sessionId: feedback.sessionId.toString(),
            userId: feedback.userId.toString(),
            trainerId: feedback.trainerId.toString(),
            rating: feedback.rating,
            review: feedback.review
        };
    }
}