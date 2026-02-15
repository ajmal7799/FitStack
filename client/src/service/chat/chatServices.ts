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
    return response.data;
}


export const markAsRead = async (chatId: string) => {
    const response = await AxiosInstance.patch(`/chat/mark-as-read/${chatId}`);
    return response.data;
}