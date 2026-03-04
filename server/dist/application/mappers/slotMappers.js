"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotMapper = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class SlotMapper {
    static toMongooseDocument(slot) {
        return {
            _id: new mongoose_1.default.Types.ObjectId(slot._id),
            trainerId: slot.trainerId,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isBooked: slot.isBooked,
            bookedBy: slot.bookedBy,
            slotStatus: slot.slotStatus,
        };
    }
    static fromMongooseDocument(slot) {
        return {
            _id: slot._id.toString(),
            trainerId: slot.trainerId.toString(),
            startTime: slot.startTime,
            endTime: slot.endTime,
            isBooked: slot.isBooked,
            bookedBy: slot.bookedBy ? slot.bookedBy.toString() : null,
            slotStatus: slot.slotStatus,
        };
    }
    static toEntity(slot) {
        return {
            _id: new mongoose_1.default.Types.ObjectId().toString(),
            trainerId: slot.trainerId.toString(),
            startTime: slot.startTime,
            endTime: slot.endTime,
            isBooked: slot.isBooked,
            bookedBy: slot.bookedBy,
            slotStatus: slot.slotStatus,
        };
    }
}
exports.SlotMapper = SlotMapper;
