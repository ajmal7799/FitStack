import { Message } from "../../domain/entities/chat/messageEnitity";
import { IMessageModel } from "../../infrastructure/database/models/messageModel";
import mongoose, { Mongoose } from 'mongoose';
import { MessageTypeEnums } from "../../domain/enum/MessageTypeEnums";



export class MessageMapper {
    static toMongooseDocument(message : Message) {
        return {
            _id: new mongoose.Types.ObjectId(message._id),
            chatId: new mongoose.Types.ObjectId(message.chatId),
            senderId: new mongoose.Types.ObjectId(message.senderId),
            type: message.type,
            text: message.text,
              attachment: message.attachment
            ? {
                  key: message.attachment.key,
                  fileName: message.attachment.fileName,
                  fileType: message.attachment.fileType,
                  fileSize: message.attachment.fileSize,
              }
            : undefined,
            isDeleted: message.isDeleted,
            deletedAt: message.deletedAt ? new Date(message.deletedAt) : undefined,
            createdAt: message.createdAt
            
        }
    }

    static fromMongooseDocument(message : IMessageModel) : Message {
        return {
            _id: message._id.toString(),
            chatId: message.chatId.toString(),
            senderId: message.senderId.toString(),
            type: message.type,
             attachment: message.attachment
            ? {
                  key: message.attachment.key,
                  fileName: message.attachment.fileName,
                  fileType: message.attachment.fileType,
                  fileSize: message.attachment.fileSize,
              }
            : undefined,

            text: message.text,
            isDeleted: message.isDeleted,
            deletedAt: message.deletedAt?.toISOString(),
            createdAt: message.createdAt?.toISOString(),

        }
    }
}