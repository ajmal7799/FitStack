import { Document, Model, model,Types } from 'mongoose';
import messageSchema from '../schema/messageSchema';

export interface IMessageModel extends Document {
    _id: Types.ObjectId;
    chatId: Types.ObjectId;
    senderId: Types.ObjectId;
    isDeleted: boolean; 
    deletedAt?: Date;
    text: string;
    createdAt: string;
}

export const messageModel = model<IMessageModel>('Message', messageSchema);