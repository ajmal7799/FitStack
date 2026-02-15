import { Document, Model, model, Types } from 'mongoose';

import chatSchema from '../schema/chatSchema';

export interface IChatModel extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  trainerId: Types.ObjectId;
  lastMessage?: string;
  lastSenderId?: Types.ObjectId;
  unreadCount: {
    user: number;
    trainer: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const chatModel = model<IChatModel>('Chat', chatSchema);
