import mongoose, { Mongoose } from 'mongoose';
import { Slot } from '../../domain/entities/trainer/slot';
import { ISlotModel } from '../../infrastructure/database/models/slotModel';
import { CreateSlotDTO } from '../dto/trainer/slot/createSlotDTO';

export class SlotMapper {
    
    static toMongooseDocument(slot : Slot) {
        return {
            _id: new mongoose.Types.ObjectId(slot._id),
            trainerId: slot.trainerId,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isBooked: slot.isBooked,
            bookedBy: slot.bookedBy,
            slotStatus: slot.slotStatus,
            cancellationReason: slot.cancellationReason,
            canceldAt: slot.canceldAt,
        };
    }

    static fromMongooseDocument(slot : ISlotModel) : Slot {
        return {
            _id: slot._id.toString(),
            trainerId: slot.trainerId.toString(),
            startTime: slot.startTime,
            endTime: slot.endTime,
            isBooked: slot.isBooked,
            bookedBy: slot.bookedBy ? slot.bookedBy.toString() : null,
            slotStatus: slot.slotStatus,
            cancellationReason: slot.cancellationReason,
            canceldAt: slot.canceldAt,
        };
    }

    static toEntity(slot : CreateSlotDTO) : Slot {
        return {
            _id: new mongoose.Types.ObjectId().toString(),
            trainerId: slot.trainerId.toString(),
            startTime: slot.startTime,
            endTime: slot.endTime,
            isBooked: slot.isBooked,
            bookedBy: slot.bookedBy,
            slotStatus: slot.slotStatus,
            cancellationReason: slot.cancellationReason,
            canceldAt: slot.canceldAt,
        };
    }

}




