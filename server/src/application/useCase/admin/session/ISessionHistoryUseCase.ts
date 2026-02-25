import { SessionHistoryAdminResult } from "../../../dto/slot/slotDTO";

export interface ISessionHistoryUseCase {
    getSessionHistory(page: number, limit: number, status?: string, search?: string): Promise<{ sessions:SessionHistoryAdminResult[], totalSessions: number, totalPages: number, currentPage: number }>;
}