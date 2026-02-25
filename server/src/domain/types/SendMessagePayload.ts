import { MessageTypeEnums } from "../enum/MessageTypeEnums";
export  type SendMessagePayload = {
  chatId: string;
  type:  MessageTypeEnums;
  text?: string;
  attachment?: {
    key: string;
    fileName: string;
    fileType: string;
    fileSize: number;
  };
};