// application/useCases/admin/revenue/GetRevenueListingUseCase.ts

import { IWalletRepository }    from '../../../../domain/interfaces/repositories/IWalletRepository';
import { IVideoCallRepository } from '../../../../domain/interfaces/repositories/IVideoCallRepository';
import { IUserRepository }      from '../../../../domain/interfaces/repositories/IUserRepository';
import {
    RevenueTransactionDTO,
    RevenueStatsDTO,
    RevenueListingDTO,
} from '../../../dto/revenue/revenueDTO';
import { IGetRevenueListingUseCase } from '../../../useCase/admin/revenue/IGetRevenueListingUseCase';


const PLATFORM_FEE_PERCENT = 0.2;
const TRAINER_FEE_PERCENT  = 0.8;

export class GetRevenueListingUseCase implements IGetRevenueListingUseCase {
    constructor(
        private _walletRepository:    IWalletRepository,
        private _videoCallRepository: IVideoCallRepository,
        private _userRepository:      IUserRepository,
    ) {}

    async execute(
        page:       number,
        limit:      number,
        search?:    string,
        startDate?: string,
        endDate?:   string,
    ): Promise<RevenueListingDTO> {

        const skip  = (page - 1) * limit;
        const start = startDate ? new Date(startDate) : undefined;
        const end   = endDate   ? new Date(endDate)   : undefined;

        // ✅ Get raw wallet transactions + stats from repository
        const [{ transactions, total }, stats] = await Promise.all([
            this._walletRepository.getAdminPlatformTransactions(skip, limit, start, end),
            this._walletRepository.getAdminPlatformTransactionStats(),
        ]);

        // ✅ Collect unique session ids
        const sessionIds = transactions
            .map((t) => t.relatedId)
            .filter((id): id is string => !!id);

        // ✅ Fetch sessions in one call — no N+1
        const sessions = await this._videoCallRepository.findByIds(sessionIds);

        // ✅ Collect unique user + trainer ids
        const userIds    = [...new Set(sessions.map((s) => s.userId))];
        const trainerIds = [...new Set(sessions.map((s) => s.trainerId))];

        // ✅ Fetch users + trainers in one call each — no N+1
        const [users, trainers] = await Promise.all([
            this._userRepository.findByIds(userIds),
            this._userRepository.findByIds(trainerIds),
        ]);

        // ✅ Build lookup maps — O(1) access
        const sessionMap = new Map(sessions.map((s) => [s._id,      s]));
        const userMap    = new Map(users.map((u)    => [u._id!,     u]));
        const trainerMap = new Map(trainers.map((t) => [t._id!,     t]));

        // ✅ Map domain entities → DTO
        const transactionDTOs: RevenueTransactionDTO[] = transactions.map((t) => {
            const session     = sessionMap.get(t.relatedId!);
            const user        = session ? userMap.get(session.userId)       : undefined;
            const trainer     = session ? trainerMap.get(session.trainerId) : undefined;

            const platformCut = t.amount;
            const sessionRate = parseFloat((platformCut / PLATFORM_FEE_PERCENT).toFixed(2));
            const trainerCut  = parseFloat((sessionRate * TRAINER_FEE_PERCENT).toFixed(2));

            return {
                sessionId:   t.relatedId  || '',
                userName:    user?.name    || 'Unknown User',
                trainerName: trainer?.name || 'Unknown Trainer',
                sessionDate: t.createdAt!,
                sessionRate,
                platformCut,
                trainerCut,
            };
        });

        // ✅ Search filter by name — after join
        const filtered = search?.trim()
            ? transactionDTOs.filter(
                (t) =>
                    t.userName.toLowerCase().includes(search.toLowerCase()) ||
                    t.trainerName.toLowerCase().includes(search.toLowerCase())
              )
            : transactionDTOs;

        const statsDTO: RevenueStatsDTO = {
            totalRevenue:     stats.totalRevenue,
            thisMonthRevenue: stats.thisMonthRevenue,
            totalSessions:    stats.totalSessions,
            avgPerSession:    stats.avgPerSession,
        };

        return {
            transactions:      filtered,
            totalTransactions: total,
            totalPages:        Math.ceil(total / limit) || 1,
            currentPage:       page,
            stats:             statsDTO,
        };
    }
}