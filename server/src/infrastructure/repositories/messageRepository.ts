import { BaseRepository } from "./baseRepository";
import { IMessageRepository } from "../../domain/interfaces/repositories/IMessageRepository";
import { MessageMapper } from "../../application/mappers/messageMappers";
import { IMessageModel } from "../database/models/messageModel";
import { Message } from "../../domain/entities/chat/messageEnitity";
import { Model } from "mongoose";


export class MessageRepository extends BaseRepository<Message, IMessageModel > implements IMessageRepository {
    constructor(protected _model: Model<IMessageModel>) {
        super(_model, MessageMapper);
    }

    async findByChatId(chatId: string): Promise<Message[]> {
     const documents = await this._model.find({chatId:chatId}).sort({ createdAt: 1 });
     return documents.map((doc) => MessageMapper.fromMongooseDocument(doc));
    }

    async softDelete(messageId: string): Promise<void> {
        await this._model.findByIdAndUpdate(
            messageId,
            { $set: { isDeleted: true, deletedAt: new Date() } },
            { new: true }
        )
    }
}