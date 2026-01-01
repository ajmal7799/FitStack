import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema(
    {
        trainerId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        startTime: {type: Date, required: true},
        endTime: {type: Date, required: true},
        isBooked: {type: Boolean, default: false},
        bookedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
    },
     { timestamps: true }
)
slotSchema.index({ trainerId: 1, startTime: 1, endTime: 1 });
export default slotSchema