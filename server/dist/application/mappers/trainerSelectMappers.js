"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerSelectMapper = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const trainerSelectionEnums_1 = require("../../domain/enum/trainerSelectionEnums");
class TrainerSelectMapper {
    static toMongooseDocument(selection) {
        return {
            _id: new mongoose_1.default.Types.ObjectId(selection.id),
            userId: selection.userId,
            trainerId: selection.trainerId,
            status: selection.status,
            selectedAt: selection.selectedAt,
        };
    }
    static fromMongooseDocument(doc) {
        return {
            id: doc._id.toString(),
            userId: doc.userId.toString(),
            trainerId: doc.trainerId.toString(),
            status: doc.status,
            selectedAt: doc.selectedAt,
        };
    }
    static toEntity(userId, trainerId) {
        return {
            id: new mongoose_1.default.Types.ObjectId().toString(),
            userId,
            trainerId,
            status: trainerSelectionEnums_1.TrainerSelectionStatus.ACTIVE,
            selectedAt: new Date()
        };
    }
}
exports.TrainerSelectMapper = TrainerSelectMapper;
