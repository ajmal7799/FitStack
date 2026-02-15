import { UserOpenChatPageResponseDTO } from "../../dto/chat/userOpenChatPageDTO";
export interface IInitiateChatUseCase {
    initiateChat(userId: string): Promise<UserOpenChatPageResponseDTO>;
}