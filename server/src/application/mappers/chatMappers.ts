import mongoose, { Mongoose } from 'mongoose';
import { Chat } from '../../domain/entities/chat/chatEntity';
import { IChatModel } from '../../infrastructure/database/models/chatModel';
import { CreateChatDTO } from '../dto/chat/createChatDTO';

export class ChatMapper {
  static toMongooseDocument(chat: Chat) {
   return {
      _id: new mongoose.Types.ObjectId(chat._id),
      userId: new mongoose.Types.ObjectId(chat.userId),
      trainerId: new mongoose.Types.ObjectId(chat.trainerId),
      unreadCount: chat.unreadCount, // ✅ Include nested unread count
      lastMessage: chat.lastMessage,
      lastSenderId: chat.lastSenderId ? new mongoose.Types.ObjectId(chat.lastSenderId) : undefined,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    };
  }

  static fromMongooseDocument(chat: IChatModel): Chat {
       return {
      _id: chat._id.toString(),
      userId: chat.userId.toString(),
      trainerId: chat.trainerId.toString(),
      lastMessage: chat.lastMessage,
      lastSenderId: chat.lastSenderId ? chat.lastSenderId.toString() : '',
      unreadCount: chat.unreadCount || { user: 0, trainer: 0 }, 
      createdAt: chat.createdAt.toISOString(),
      updatedAt: chat.updatedAt.toISOString(),
    };
  }

  static toEntity(chatDoc: CreateChatDTO): Chat {
    return {
      _id: new mongoose.Types.ObjectId().toString(),
      userId: chatDoc.userId.toString(),
      trainerId: chatDoc.trainerId.toString(),
      lastMessage: '',
      lastSenderId: '',
      unreadCount: { user: 0, trainer: 0 },
      createdAt: chatDoc.createdAt,
      updatedAt: chatDoc.createdAt,
    };
  }
}
