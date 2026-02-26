// infrastructure/repositories/trainerDashboardRepository.ts
import { Model } from 'mongoose';
import { ITrainerDashboardRepository } from '../../domain/interfaces/repositories/ITrainerDashboardRepository';
import { TrainerDashboardStats, TrainerDashboardChartData, TrainerFilterPeriod, TrainerChartDataPoint, TopRatedSession } from '../../domain/entities/trainer/trainerDashboardEntities';
import { IVideoCallModel } from '../database/models/videoCallModel';
import { IWalletModel } from '../database/models/walletModel';
import { IFeedbackModel } from '../database/models/feedbackModel';
import { ITrainerSelectModel } from '../database/models/trainerSelectModel';
import { IUserModel } from '../database/models/userModel';
import { VideoCallStatus } from '../../domain/enum/videoCallEnums';
import { WalletTransactionType } from '../../domain/enum/WalletTransactionType';
import { Types } from 'mongoose';

export class TrainerDashboardRepository implements ITrainerDashboardRepository {
    constructor(
        private _videoCallModel: Model<IVideoCallModel>,
        private _walletModel: Model<IWalletModel>,
        private _feedbackModel: Model<IFeedbackModel>,
        private _trainerSelectModel: Model<ITrainerSelectModel>,
        private _userModel: Model<IUserModel>,
    ) {}

    async getStats(trainerId: string): Promise<TrainerDashboardStats> {
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        const [
            totalSessions,
            completedSessions,
            missedSessions,
            cancelledSessions,
            totalClients,
            walletData,
            thisMonthEarnings,
            lastMonthEarnings,
            feedbackData,
        ] = await Promise.all([
            this._videoCallModel.countDocuments({ trainerId }),
            this._videoCallModel.countDocuments({ trainerId, status: VideoCallStatus.COMPLETED }),
            this._videoCallModel.countDocuments({ trainerId, status: VideoCallStatus.MISSED }),
            this._videoCallModel.countDocuments({ trainerId, status: VideoCallStatus.CANCELLED }),
            this._trainerSelectModel.countDocuments({ trainerId }),
            // Total earnings
            this._walletModel.aggregate([
                { $match: { ownerId: new Types.ObjectId(trainerId), ownerType: 'trainer' } },
                { $unwind: '$transactions' },
                { $match: { 'transactions.type': WalletTransactionType.SESSION_COMMISSION } },
                { $group: { _id: null, total: { $sum: '$transactions.amount' } } },
            ]),
            // This month earnings
            this._walletModel.aggregate([
                { $match: { ownerId: new Types.ObjectId(trainerId), ownerType: 'trainer' } },
                { $unwind: '$transactions' },
                {
                    $match: {
                        'transactions.type': WalletTransactionType.SESSION_COMMISSION,
                        'transactions.createdAt': { $gte: startOfThisMonth },
                    },
                },
                { $group: { _id: null, total: { $sum: '$transactions.amount' } } },
            ]),
            // Last month earnings
            this._walletModel.aggregate([
                { $match: { ownerId: new Types.ObjectId(trainerId), ownerType: 'trainer' } },
                { $unwind: '$transactions' },
                {
                    $match: {
                        'transactions.type': WalletTransactionType.SESSION_COMMISSION,
                        'transactions.createdAt': { $gte: startOfLastMonth, $lte: endOfLastMonth },
                    },
                },
                { $group: { _id: null, total: { $sum: '$transactions.amount' } } },
            ]),
            // Average rating
            this._feedbackModel.aggregate([
                { $match: { trainerId: new Types.ObjectId(trainerId) } },
                { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
            ]),
        ]);

        return {
            totalEarnings: walletData[0]?.total || 0,
            thisMonthEarnings: thisMonthEarnings[0]?.total || 0,
            lastMonthEarnings: lastMonthEarnings[0]?.total || 0,
            totalSessions,
            completedSessions,
            missedSessions,
            cancelledSessions,
            totalClients,
            averageRating: parseFloat((feedbackData[0]?.avg || 0).toFixed(1)),
            totalRatings: feedbackData[0]?.count || 0,
        };
    }

    async getChartData(trainerId: string, period: TrainerFilterPeriod): Promise<TrainerDashboardChartData> {
        const { startDate, groupFormat, labels, dateKeys } = this.getPeriodConfig(period);

        const [earningsChart, sessionStatusChart, clientGrowthChart, topRatedSessions] = await Promise.all([
            this.getEarningsChart(trainerId, startDate, groupFormat, labels, dateKeys),
            this.getSessionStatusChart(trainerId),
            this.getClientGrowthChart(trainerId, startDate, groupFormat, labels, dateKeys),
            this.getTopRatedSessions(trainerId),
        ]);

        return { earningsChart, sessionStatusChart, clientGrowthChart, topRatedSessions };
    }

    private getPeriodConfig(period: TrainerFilterPeriod) {
        const now = new Date();
        let startDate: Date;
        let groupFormat: string;
        let labels: string[] = [];
        let dateKeys: string[] = [];

        switch (period) {
            case 'daily':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 6);
                startDate.setHours(0, 0, 0, 0);
                groupFormat = '%Y-%m-%d';
                for (let i = 6; i >= 0; i--) {
                    const d = new Date(now);
                    d.setDate(now.getDate() - i);
                    labels.push(d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }));
                    dateKeys.push(d.toISOString().split('T')[0]);
                }
                break;

            case 'weekly':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 55);
                startDate.setHours(0, 0, 0, 0);
                groupFormat = '%Y-%U';
                for (let i = 7; i >= 0; i--) {
                    const weekEnd = new Date(now);
                    weekEnd.setDate(now.getDate() - (i * 7));
                    const weekStart = new Date(weekEnd);
                    weekStart.setDate(weekEnd.getDate() - 6);
                    const cappedEnd = weekEnd > now ? now : weekEnd;
                    const startLabel = weekStart.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
                    const endLabel = cappedEnd.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
                    labels.push(`${startLabel} - ${endLabel}`);
                    const year = weekStart.getFullYear();
                    const startOfYear = new Date(year, 0, 1);
                    const weekNum = Math.floor(((weekStart.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
                    dateKeys.push(`${year}-${String(weekNum).padStart(2, '0')}`);
                }
                break;

            case 'monthly':
                startDate = new Date(now);
                startDate.setMonth(now.getMonth() - 11);
                startDate.setDate(1);
                startDate.setHours(0, 0, 0, 0);
                groupFormat = '%Y-%m';
                for (let i = 11; i >= 0; i--) {
                    const d = new Date(now);
                    d.setMonth(now.getMonth() - i);
                    labels.push(d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }));
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    dateKeys.push(`${year}-${month}`);
                }
                break;

            case 'yearly':
            default:
                startDate = new Date(now);
                startDate.setFullYear(now.getFullYear() - 2);
                startDate.setMonth(0, 1);
                startDate.setHours(0, 0, 0, 0);
                groupFormat = '%Y';
                for (let i = 2; i >= 0; i--) {
                    const year = String(now.getFullYear() - i);
                    labels.push(year);
                    dateKeys.push(year);
                }
                break;
        }

        return { startDate, groupFormat, labels, dateKeys };
    }

    private fillMissingLabels(labels: string[], dateKeys: string[], data: { _id: string; value: number }[]): TrainerChartDataPoint[] {
        const dataMap = new Map(data.map(item => [item._id, item.value]));
        return labels.map((label, index) => ({
            label,
            value: dataMap.get(dateKeys[index]) || 0,
        }));
    }

    private async getEarningsChart(trainerId: string, startDate: Date, groupFormat: string, labels: string[], dateKeys: string[]): Promise<TrainerChartDataPoint[]> {
        const result = await this._walletModel.aggregate([
            { $match: { ownerId: new Types.ObjectId(trainerId), ownerType: 'trainer' } },
            { $unwind: '$transactions' },
            {
                $match: {
                    'transactions.type': WalletTransactionType.SESSION_COMMISSION,
                    'transactions.createdAt': { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: groupFormat, date: '$transactions.createdAt' } },
                    value: { $sum: '$transactions.amount' },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        return this.fillMissingLabels(labels, dateKeys, result);
    }

    private async getSessionStatusChart(trainerId: string): Promise<TrainerChartDataPoint[]> {
        const result = await this._videoCallModel.aggregate([
            { $match: { trainerId: new Types.ObjectId(trainerId) } },
            { $group: { _id: '$status', value: { $sum: 1 } } },
        ]);

        const statusMap: Record<string, string> = {
            [VideoCallStatus.COMPLETED]: 'Completed',
            [VideoCallStatus.MISSED]: 'Missed',
            [VideoCallStatus.CANCELLED]: 'Cancelled',
            [VideoCallStatus.WAITING]: 'Upcoming',
        };

        return result.map(item => ({
            label: statusMap[item._id] || item._id,
            value: item.value,
        }));
    }

    private async getClientGrowthChart(trainerId: string, startDate: Date, groupFormat: string, labels: string[], dateKeys: string[]): Promise<TrainerChartDataPoint[]> {
        const result = await this._trainerSelectModel.aggregate([
            { $match: { trainerId: new Types.ObjectId(trainerId), createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
                    value: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        return this.fillMissingLabels(labels, dateKeys, result);
    }

    private async getTopRatedSessions(trainerId: string): Promise<TopRatedSession[]> {
        const result = await this._feedbackModel.aggregate([
            { $match: { trainerId: new Types.ObjectId(trainerId), rating: { $gte: 4 } } },
            { $sort: { rating: -1, createdAt: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDoc',
                },
            },
            { $unwind: '$userDoc' },
        ]);

        return result.map(item => ({
            sessionId: item.sessionId?.toString(),
            userName: item.userDoc?.name || 'Unknown',
            userAvatar: item.userDoc?.name?.charAt(0).toUpperCase() || 'U',
            rating: item.rating,
            review: item.review || '',
            date: new Date(item.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric'
            }),
        }));
    }
}