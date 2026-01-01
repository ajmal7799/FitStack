import { Document, model,Types } from 'mongoose';
import trainerSelectSchema from '../schema/trainerSelectSchema';
import { TrainerSelectionStatus } from '../../../domain/enum/trainerSelectionEnums';

export interface ITrainerSelectModel extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId; 
    trainerId: Types.ObjectId;
    status: TrainerSelectionStatus;
    selectedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export const trainerSelectModel = model<ITrainerSelectModel>('TrainerSelect', trainerSelectSchema);