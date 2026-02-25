import { SessionHistoryAdminDetailsResult } from "../../../dto/slot/slotDTO";

export interface ISessionAdminHistoryUseCase {
    getSessionHistoryDetails(sessionId: string): Promise<SessionHistoryAdminDetailsResult>;
}