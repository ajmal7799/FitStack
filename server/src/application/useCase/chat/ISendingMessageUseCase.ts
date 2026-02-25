
import { Message } from "../../../domain/entities/chat/messageEnitity";
import { MessageTypeEnums } from "../../../domain/enum/MessageTypeEnums";
import { SendMessageDTO } from "../../dto/chat/SendMessageDTO";
export interface ISendingMessageUseCase {
    sendMessage(data: SendMessageDTO): Promise<Message>;
}