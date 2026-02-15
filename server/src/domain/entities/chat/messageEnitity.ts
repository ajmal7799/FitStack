
export interface Message {
    _id: string;
    chatId: string;
    senderId: string;
    isDeleted: boolean;
    deletedAt?: string;
    text: string;
    createdAt: string;
    
}