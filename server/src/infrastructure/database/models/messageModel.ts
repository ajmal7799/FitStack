import { Document, model, Types } from "mongoose";
import messageSchema from "../schema/messageSchema";
import { MessageTypeEnums } from "../../../domain/enum/MessageTypeEnums";

export interface IMessageModel extends Document {
  _id: Types.ObjectId;

  chatId: Types.ObjectId;
  senderId: Types.ObjectId;

  type: MessageTypeEnums;

  text?: string;

  attachment?: {
    key: string;
    fileName: string;
    fileType: string;
    fileSize: number;
  };

  isDeleted: boolean;
  deletedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const messageModel = model<IMessageModel>(
  "Message",
  messageSchema
);