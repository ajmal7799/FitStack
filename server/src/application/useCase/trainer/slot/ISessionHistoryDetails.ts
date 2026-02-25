import { SessionHistoryTrainerDetailsResult } from "../../../dto/slot/slotDTO";
export interface ISessionHistoryDetailsUseCase {
    getTrainerSessionHistoryDetails(trainerId: string, sessionId: string): Promise<SessionHistoryTrainerDetailsResult>;
}