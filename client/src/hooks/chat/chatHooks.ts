import { intiateChat,getMessages, intiateChatTrainer,markAsRead } from "../../service/chat/chatServices";
import {  useQuery, useQueryClient, useMutation } from "@tanstack/react-query";


export const useInitiateChat = () => {
    return useQuery({
        queryKey: ["initiateChat"],
        queryFn: () => intiateChat(),
    });
}

export const useInitiateChatTrainer = () => {
    return useQuery({
        queryKey: ["initiateChatTrainer"],
        queryFn: () => intiateChatTrainer(),
    });
}

export const useGetMessages = (chatId: string) => {
    return useQuery({
        queryKey: ["getMessages", chatId],
        queryFn: () => getMessages(chatId),
    });
}

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chatId: string) => markAsRead(chatId),
    onSuccess: () => {
      // Invalidate chat queries to refresh unread counts
      queryClient.invalidateQueries({ queryKey: ['initiateChat'] });
    },
    onError: (error) => {
      console.error('Failed to mark chat as read:', error);
    }
  });
};
    