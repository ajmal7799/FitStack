
import { Message } from "../../../domain/entities/chat/messageEnitity";
export interface ISendingMessageUseCase {
    sendMessage(chatId: string,senderId: string, text: string): Promise<Message>;
}