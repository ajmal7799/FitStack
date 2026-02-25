
import { MessageTypeEnums } from "../../enum/MessageTypeEnums";




export interface Message {
    _id: string;
    chatId: string;
    senderId: string;

    type: MessageTypeEnums;

    text?: string;        
    attachment?:  {
        key: string;        
        fileName: string;  
        fileType: string;   
        fileSize: number;   
        url?: string
    } 

    isDeleted: boolean;
    deletedAt?: string;

    createdAt: string;
}