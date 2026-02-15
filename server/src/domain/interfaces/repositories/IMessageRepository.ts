import { IBaseRepository } from "./IBaseRepository";
import { Message } from "../../entities/chat/messageEnitity";

export interface IMessageRepository extends IBaseRepository<Message> {
    findByChatId(chatId: string): Promise<Message[]>;
    softDelete(messageId: string): Promise<void>;
}