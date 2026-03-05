"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerDashboardRepository = void 0;
// infrastructure/repositories/trainerDashboardRepository.ts
const mongoose_1 = require("mongoose");
const videoCallEnums_1 = require("../../domain/enum/videoCallEnums");
const WalletTransactionType_1 = require("../../domain/enum/WalletTransactionType");
class TrainerDashboardRepository {
    constructor(_videoCallModel, _walletModel, _feedbackModel, _trainerSelectModel, _userModel) {
        this._videoCallModel = _videoCallModel;
        this._walletModel = _walletModel;
        this._feedbackModel = _feedbackModel;
        this._trainerSelectModel = _trainerSelectModel;
        this._userModel = _userModel;
    }
    getStats(trainerId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const now = new Date();
            const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            const [totalSessions, completedSessions, missedSessions, cancelledSessions, totalClients, walletData, thisMonthEarnings, lastMonthEarnings, feedbackData,] = yield Promise.all([
                this._videoCallModel.countDocuments({ trainerId }),
                this._videoCallModel.countDocuments({ trainerId, status: videoCallEnums_1.VideoCallStatus.COMPLETED }),
                this._videoCallModel.countDocuments({ trainerId, status: videoCallEnums_1.VideoCallStatus.MISSED }),
                this._videoCallModel.countDocuments({ trainerId, status: videoCallEnums_1.VideoCallStatus.CANCELLED }),
                this._trainerSelectModel.countDocuments({ trainerId }),
                // Total earnings
                this._walletModel.aggregate([
                    { $match: { ownerId: new mongoose_1.Types.ObjectId(trainerId), ownerType: 'trainer' } },
                    { $unwind: '$transactions' },
                    { $match: { 'transactions.type': WalletTransactionType_1.WalletTransactionType.SESSION_COMMISSION } },
                    { $group: { _id: null, total: { $sum: '$transactions.amount' } } },
                ]),
                // This month earnings
                this._walletModel.aggregate([
                    { $match: { ownerId: new mongoose_1.Types.ObjectId(trainerId), ownerType: 'trainer' } },
                    { $unwind: '$transactions' },
                    {
                        $match: {
                            'transactions.type': WalletTransactionType_1.WalletTransactionType.SESSION_COMMISSION,
                            'transactions.createdAt': { $gte: startOfThisMonth },
                        },
                    },
                    { $group: { _id: null, total: { $sum: '$transactions.amount' } } },
                ]),
                // Last month earnings
                this._walletModel.aggregate([
                    { $match: { ownerId: new mongoose_1.Types.ObjectId(trainerId), ownerType: 'trainer' } },
                    { $unwind: '$transactions' },
                    {
                        $match: {
                            'transactions.type': WalletTransactionType_1.WalletTransactionType.SESSION_COMMISSION,
                            'transactions.createdAt': { $gte: startOfLastMonth, $lte: endOfLastMonth },
                        },
                    },
                    { $group: { _id: null, total: { $sum: '$transactions.amount' } } },
                ]),
                // Average rating
                this._feedbackModel.aggregate([
                    { $match: { trainerId: new mongoose_1.Types.ObjectId(trainerId) } },
                    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
                ]),
            ]);
            return {
                totalEarnings: ((_a = walletData[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
                thisMonthEarnings: ((_b = thisMonthEarnings[0]) === null || _b === void 0 ? void 0 : _b.total) || 0,
                lastMonthEarnings: ((_c = lastMonthEarnings[0]) === null || _c === void 0 ? void 0 : _c.total) || 0,
                totalSessions,
                completedSessions,
                missedSessions,
                cancelledSessions,
                totalClients,
                averageRating: parseFloat((((_d = feedbackData[0]) === null || _d === void 0 ? void 0 : _d.avg) || 0).toFixed(1)),
                totalRatings: ((_e = feedbackData[0]) === null || _e === void 0 ? void 0 : _e.count) || 0,
            };
        });
    }
    getChartData(trainerId, period) {
        return __awaiter(this, void 0, void 0, function* () {
            const { startDate, groupFormat, labels, dateKeys } = this.getPeriodConfig(period);
            const [earningsChart, sessionStatusChart, clientGrowthChart, topRatedSessions] = yield Promise.all([
                this.getEarningsChart(trainerId, startDate, groupFormat, labels, dateKeys),
                this.getSessionStatusChart(trainerId),
                this.getClientGrowthChart(trainerId, startDate, groupFormat, labels, dateKeys),
                this.getTopRatedSessions(trainerId),
            ]);
            return { earningsChart, sessionStatusChart, clientGrowthChart, topRatedSessions };
        });
    }
    getPeriodConfig(period) {
        const now = new Date();
        let startDate;
        let groupFormat;
        const labels = [];
        const dateKeys = [];
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
    fillMissingLabels(labels, dateKeys, data) {
        const dataMap = new Map(data.map(item => [item._id, item.value]));
        return labels.map((label, index) => ({
            label,
            value: dataMap.get(dateKeys[index]) || 0,
        }));
    }
    getEarningsChart(trainerId, startDate, groupFormat, labels, dateKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._walletModel.aggregate([
                { $match: { ownerId: new mongoose_1.Types.ObjectId(trainerId), ownerType: 'trainer' } },
                { $unwind: '$transactions' },
                {
                    $match: {
                        'transactions.type': WalletTransactionType_1.WalletTransactionType.SESSION_COMMISSION,
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
        });
    }
    getSessionStatusChart(trainerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._videoCallModel.aggregate([
                { $match: { trainerId: new mongoose_1.Types.ObjectId(trainerId) } },
                { $group: { _id: '$status', value: { $sum: 1 } } },
            ]);
            const statusMap = {
                [videoCallEnums_1.VideoCallStatus.COMPLETED]: 'Completed',
                [videoCallEnums_1.VideoCallStatus.MISSED]: 'Missed',
                [videoCallEnums_1.VideoCallStatus.CANCELLED]: 'Cancelled',
                [videoCallEnums_1.VideoCallStatus.WAITING]: 'Upcoming',
            };
            return result.map(item => ({
                label: statusMap[item._id] || item._id,
                value: item.value,
            }));
        });
    }
    getClientGrowthChart(trainerId, startDate, groupFormat, labels, dateKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._trainerSelectModel.aggregate([
                { $match: { trainerId: new mongoose_1.Types.ObjectId(trainerId), createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
                        value: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]);
            return this.fillMissingLabels(labels, dateKeys, result);
        });
    }
    getTopRatedSessions(trainerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._feedbackModel.aggregate([
                { $match: { trainerId: new mongoose_1.Types.ObjectId(trainerId), rating: { $gte: 4 } } },
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
            return result.map(item => {
                var _a, _b, _c, _d;
                return ({
                    sessionId: (_a = item.sessionId) === null || _a === void 0 ? void 0 : _a.toString(),
                    userName: ((_b = item.userDoc) === null || _b === void 0 ? void 0 : _b.name) || 'Unknown',
                    userAvatar: ((_d = (_c = item.userDoc) === null || _c === void 0 ? void 0 : _c.name) === null || _d === void 0 ? void 0 : _d.charAt(0).toUpperCase()) || 'U',
                    rating: item.rating,
                    review: item.review || '',
                    date: new Date(item.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                    }),
                });
            });
        });
    }
}
exports.TrainerDashboardRepository = TrainerDashboardRepository;
