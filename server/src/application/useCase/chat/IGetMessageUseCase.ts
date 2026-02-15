import { Message } from "../../../domain/entities/chat/messageEnitity";

export interface IGetMessageUseCase {
    getMessages(userId: string, chatId: string): Promise<Message[]>;
}