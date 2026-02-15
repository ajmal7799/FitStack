import { IChatRepository } from "../../domain/interfaces/repositories/IChatRepository";
import { BaseRepository } from "./baseRepository";
import { Chat } from "../../domain/entities/chat/chatEntity";
import { IChatModel } from "../database/models/chatModel";
import { ChatMapper } from "../../application/mappers/chatMappers";
import { Model } from "mongoose";

export class ChatRepository extends BaseRepository<Chat, IChatModel > implements IChatRepository {
   constructor(protected _model: Model<IChatModel>) {
    super(_model, ChatMapper);
   }

  async findByParticipants(userId: string, trainerId: string): Promise<Chat | null> {
       return await this._model.findOne({
      userId: userId,
      trainerId: trainerId
    })
   }

  async updateLastMessage(chatId: string, data: { lastMessage: string; senderId: string; incrementUnreadFor: 'user' | 'trainer' }): Promise<void> {
   const incrementField = `unreadCount.${data.incrementUnreadFor}`;
      await this._model.findByIdAndUpdate(chatId,{
         $set: {
            lastMessage: data.lastMessage,
            lastSenderId: data.senderId,
            updatedAt: new Date().toISOString()
         },
         $inc: {[incrementField]: 1}
      },{new: true})
   }

  async resetUnreadCount(chatId: string, userType: 'user' | 'trainer'): Promise<void> {
   const resetField = `unreadCount.${userType}`;
      await this._model.findByIdAndUpdate(chatId,{$set: {[resetField]: 0}},{new: true});
   }

    async updateLastMessageOnly(chatId: string, data: { lastMessage: string; senderId: string; }): Promise<void> {
      await this._model.findByIdAndUpdate(chatId,{
         $set: {
            lastMessage: data.lastMessage,
            lastSenderId: data.senderId,
            updatedAt: new Date().toISOString()
         }
      },{new: true})
   }

}