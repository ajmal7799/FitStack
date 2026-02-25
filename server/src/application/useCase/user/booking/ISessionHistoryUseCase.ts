import { SessionHistoryResult } from "../../../dto/slot/slotDTO";

export interface ISessionHistoryUseCase {
  getSessionHistory(userId: string, page: number, limit: number, ): Promise<{sessions: SessionHistoryResult[], totalSessions: number, totalPages: number, currentPage: number}>;
}