import { SessionHistoryDetailsResult } from "../../../dto/slot/slotDTO";

export interface ISessionHistoryDetailsUseCase {
    getSessionHistoryDetails(userId: string, sessionId: string): Promise<SessionHistoryDetailsResult>;
}