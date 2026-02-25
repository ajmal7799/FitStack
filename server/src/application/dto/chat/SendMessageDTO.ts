import { MessageTypeEnums } from "../../../domain/enum/MessageTypeEnums";
export interface SendMessageDTO {
  chatId: string;
  senderId: string;
  type: MessageTypeEnums;
  text?: string;
  attachment?: {
    key: string;
    fileName: string;
    fileType: string;
    fileSize: number;
  };
}