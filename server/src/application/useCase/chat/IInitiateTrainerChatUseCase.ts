import { TrainerOpenChatPageResponseDTO } from "../../dto/chat/userOpenChatPageDTO";
export interface IInitiateTrainerChatUseCase {
    initiateChatTrainer(trainerId: string): Promise<TrainerOpenChatPageResponseDTO[]>;
}