
export interface Chat {
    _id: string;
    userId: string;
    trainerId: string;
    lastMessage?: string;   
    lastSenderId?: string; 
    unreadCount: {
    user: number;      
    trainer: number;   
  };
    createdAt: string;
    updatedAt: string;
}