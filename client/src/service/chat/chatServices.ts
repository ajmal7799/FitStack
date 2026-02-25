import AxiosInstance from "../../axios/axios";

export const intiateChat = async () => {
    const response = await AxiosInstance.get('/chat/initiate');
    return response.data;
}

export const intiateChatTrainer = async () => {
    const response = await AxiosInstance.get('/chat/initiatetrainer');
    return response.data;
}

export const getMessages = async (chatId: string) => {
    const response = await AxiosInstance.get(`/chat/messages/${chatId}`);
        console.log('📨 getMessages response:', response.data); // ← add this

    return response.data;
}


export const markAsRead = async (chatId: string) => {
    const response = await AxiosInstance.patch(`/chat/mark-as-read/${chatId}`);
    return response.data;
}


export const getAttachmentUploadUrl = async (
    chatId: string,
    fileName: string,
    fileType: string
): Promise<{ uploadUrl: string; key: string }> => {
    const params = new URLSearchParams({ chatId, fileName, fileType });
    const response = await AxiosInstance.get(`/chat/attachment/upload-url?${params}`);
    console.log('🔑 response.data:', JSON.stringify(response.data));
    return response.data.data; // ← must be exactly this
}
// Upload file directly to S3 using presigned URL
export const uploadFileToS3 = async (uploadUrl: string, file: File): Promise<void> => {
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });
}