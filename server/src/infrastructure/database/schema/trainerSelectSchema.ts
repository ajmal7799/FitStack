import mongoose from 'mongoose';
import { TrainerSelectionStatus } from '../../../domain/enum/trainerSelectionEnums';

const trainerSelectSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        status: {type : String, enum: Object.values(TrainerSelectionStatus), required: true },
        selectedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
)


export default trainerSelectSchema;


