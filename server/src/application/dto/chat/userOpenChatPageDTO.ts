

export interface UserOpenChatPageResponseDTO {
    chatId: string;
    userId: string
    trainerName: string | null;
    trainerProfilePic: string | null;
    unreadCount: number,
    lastMessage?: {
      text: string;
      timestamp: string;
      senderId: string;
      isDeleted?: boolean; 
    }
    
}

export interface TrainerOpenChatPageResponseDTO {
    chatId: string;
    userId: string;
    userName: string | null;
    userProfilePic: string | null;
    unreadCount: number; 
    lastMessage?: {    
        text: string;
        timestamp: string;
        senderId: string;
    };
}