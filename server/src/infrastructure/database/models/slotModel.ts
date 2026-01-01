import { Document, Model, model,Types } from 'mongoose';

import slotSchema from '../schema/slotSchema';

export interface ISlotModel extends Document {
    _id: Types.ObjectId;
    trainerId: Types.ObjectId;
    startTime: Date;
    endTime: Date;
    isBooked: boolean;
    bookedBy: Types.ObjectId | null;
}

export const slotModel = model<ISlotModel>('Slot', slotSchema)