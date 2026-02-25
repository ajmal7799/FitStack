import {
  intiateChat,
  getMessages,
  intiateChatTrainer,
  markAsRead,
  getAttachmentUploadUrl,
  uploadFileToS3,
} from "../../service/chat/chatServices";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export const useInitiateChat = () => {
  return useQuery({
    queryKey: ["initiateChat"],
    queryFn: () => intiateChat(),
  });
};

export const useInitiateChatTrainer = () => {
  return useQuery({
    queryKey: ["initiateChatTrainer"],
    queryFn: () => intiateChatTrainer(),
  });
};

export const useGetMessages = (chatId: string) => {
  return useQuery({
    queryKey: ["getMessages", chatId],
    queryFn: () => getMessages(chatId),
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chatId: string) => markAsRead(chatId),
    onSuccess: () => {
      // Invalidate chat queries to refresh unread counts
      queryClient.invalidateQueries({ queryKey: ["initiateChat"] });
    },
    onError: (error) => {
      console.error("Failed to mark chat as read:", error);
    },
  });
};

export const useUploadAttachment = () => {
  return useMutation({
    mutationFn: async ({ chatId, file }: { chatId: string; file: File }) => {
      const { uploadUrl, key } = await getAttachmentUploadUrl(
        chatId,
        file.name,
        file.type,
      );
      console.log("🔑 uploadUrl:", uploadUrl);
      console.log("🔑 key:", key);

      if (!uploadUrl || !key) {
        throw new Error("Failed to get upload URL");
      }

      await uploadFileToS3(uploadUrl, file);

      return {
        key,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      };
    },
  });
};
