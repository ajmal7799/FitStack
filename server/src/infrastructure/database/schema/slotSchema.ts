import mongoose from 'mongoose';
import { SlotStatus } from '../../../domain/enum/SlotEnums';

const slotSchema = new mongoose.Schema(
    {
        trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        isBooked: { type: Boolean, default: false },
        slotStatus: { type: String, enum: Object.values(SlotStatus), default: SlotStatus.AVAILABLE },
        bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        cancellationReason: { type: String, default: null },
        canceldAt: { type: Date, default: null },
    },
    { timestamps: true },
);
slotSchema.index({ trainerId: 1, startTime: 1, endTime: 1 });
export default slotSchema;