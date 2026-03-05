"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackMapper = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class FeedbackMapper {
    static toMongooseDocument(feedback) {
        return {
            _id: new mongoose_1.default.Types.ObjectId(feedback._id),
            sessionId: new mongoose_1.default.Types.ObjectId(feedback.sessionId),
            userId: new mongoose_1.default.Types.ObjectId(feedback.userId),
            trainerId: new mongoose_1.default.Types.ObjectId(feedback.trainerId),
            rating: feedback.rating,
            review: feedback.review,
        };
    }
    static fromMongooseDocument(feedback) {
        return {
            _id: feedback._id.toString(),
            sessionId: feedback.sessionId.toString(),
            userId: feedback.userId.toString(),
            trainerId: feedback.trainerId.toString(),
            rating: feedback.rating,
            review: feedback.review,
            createdAt: feedback.createdAt,
        };
    }
    static toEntity(feedback) {
        return {
            _id: new mongoose_1.default.Types.ObjectId().toString(),
            sessionId: feedback.sessionId.toString(),
            userId: feedback.userId.toString(),
            trainerId: feedback.trainerId.toString(),
            rating: feedback.rating,
            review: feedback.review,
        };
    }
}
exports.FeedbackMapper = FeedbackMapper;
