import { Message } from "../../domain/entities/chat/messageEnitity";
import { IMessageModel } from "../../infrastructure/database/models/messageModel";
import mongoose, { Mongoose } from 'mongoose';



export class MessageMapper {
    static toMongooseDocument(message : Message) {
        return {
            _id: new mongoose.Types.ObjectId(message._id),
            chatId: new mongoose.Types.ObjectId(message.chatId),
            senderId: new mongoose.Types.ObjectId(message.senderId),
            text: message.text,
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
            text: message.text,
            isDeleted: message.isDeleted,
            deletedAt: message.deletedAt?.toISOString(),
            createdAt: message.createdAt
        }
    }
}