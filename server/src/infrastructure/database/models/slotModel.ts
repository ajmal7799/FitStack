import { Document, Model, model,Types } from 'mongoose';

import slotSchema from '../schema/slotSchema';
import { SlotStatus } from '../../../domain/enum/SlotEnums';

export interface ISlotModel extends Document {
    _id: Types.ObjectId;
    trainerId: Types.ObjectId;
    startTime: Date;
    endTime: Date;
    isBooked: boolean;
    slotStatus: SlotStatus;
    bookedBy: Types.ObjectId | null;
    cancellationReason: string | null;
    canceldAt: Date | null;
}

export const slotModel = model<ISlotModel>('Slot', slotSchema);