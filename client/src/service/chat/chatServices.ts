import AxiosInstance from '../../axios/axios';
import { API_ROUTES } from '../../constants/apiRoutes';

export const intiateChat = async () => {
  const response = await AxiosInstance.get(API_ROUTES.CHAT.INTIATE_CHAT);
  return response.data;
};

export const intiateChatTrainer = async () => {
  const response = await AxiosInstance.get(API_ROUTES.CHAT.INTIATE_CHAT_TRAINER);
  return response.data;
};

export const getMessages = async (chatId: string) => {
  const response = await AxiosInstance.get(`${API_ROUTES.CHAT.GET_MESSAGES}/${chatId}`);

  return response.data;
};


export const markAsRead = async (chatId: string) => {
  const response = await AxiosInstance.patch(`${API_ROUTES.CHAT.MARK_AS_READ}/${chatId}`);
  return response.data;
};


export const getAttachmentUploadUrl = async (
  chatId: string,
  fileName: string,
  fileType: string
): Promise<{ uploadUrl: string; key: string }> => {
  const params = new URLSearchParams({ chatId, fileName, fileType });
  const response = await AxiosInstance.get(`${API_ROUTES.CHAT.GET_ATTACHMENT_UPLOAD_URL}?${params}`);
  return response.data.data; 
};

// Upload file directly to S3 using presigned URL
export const uploadFileToS3 = async (uploadUrl: string, file: File): Promise<void> => {
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });
};