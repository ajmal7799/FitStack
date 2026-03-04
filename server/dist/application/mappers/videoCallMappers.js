"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoCallMapper = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class VideoCallMapper {
    static toMongooseDocument(videoCall) {
        return {
            _id: new mongoose_1.default.Types.ObjectId(videoCall._id),
            userId: new mongoose_1.default.Types.ObjectId(videoCall.userId),
            trainerId: new mongoose_1.default.Types.ObjectId(videoCall.trainerId),
            slotId: new mongoose_1.default.Types.ObjectId(videoCall.slotId),
            roomId: videoCall.roomId,
            trainerJoined: videoCall.trainerJoined,
            userJoined: videoCall.userJoined,
            startedAt: videoCall.startedAt,
            endedAt: videoCall.endedAt,
            startTime: videoCall.startTime,
            endTime: videoCall.endTime,
            status: videoCall.status,
            cancellationReason: videoCall.cancellationReason,
            cancelledAt: videoCall.cancelledAt,
            cancelledBy: videoCall.cancelledBy,
        };
    }
    static fromMongooseDocument(videoCall) {
        return {
            _id: videoCall._id.toString(),
            userId: videoCall.userId.toString(),
            trainerId: videoCall.trainerId.toString(),
            slotId: videoCall.slotId.toString(),
            roomId: videoCall.roomId,
            trainerJoined: videoCall.trainerJoined,
            userJoined: videoCall.userJoined,
            startedAt: videoCall.startedAt,
            endedAt: videoCall.endedAt,
            startTime: videoCall.startTime,
            endTime: videoCall.endTime,
            status: videoCall.status,
            cancellationReason: videoCall.cancellationReason,
            cancelledAt: videoCall.cancelledAt,
            cancelledBy: videoCall.cancelledBy,
        };
    }
    static toEnitity(videoCall) {
        return {
            _id: new mongoose_1.default.Types.ObjectId().toString(),
            userId: videoCall.userId,
            trainerId: videoCall.trainerId,
            slotId: videoCall.slotId,
            roomId: videoCall.roomId,
            trainerJoined: videoCall.trainerJoined,
            userJoined: videoCall.userJoined,
            startedAt: videoCall.startedAt,
            endedAt: videoCall.endedAt,
            startTime: videoCall.startTime,
            endTime: videoCall.endTime,
            status: videoCall.status,
            cancellationReason: videoCall.cancellationReason,
            cancelledAt: videoCall.cancelledAt,
            cancelledBy: videoCall.cancelledBy,
        };
    }
}
exports.VideoCallMapper = VideoCallMapper;
