import { SessionHistoryResult, SessionHistoryTrainerResult } from "../../../dto/slot/slotDTO";


export interface ISessionHistoryUseCase {
  getTrainerSessionHistory(trainerId: string, page: number, limit: number, search?: string): Promise<{sessions: SessionHistoryTrainerResult[], totalSessions: number, totalPages: number, currentPage: number}>;
}
