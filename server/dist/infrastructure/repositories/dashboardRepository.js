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
exports.DashboardRepository = void 0;
const userEnums_1 = require("../../domain/enum/userEnums");
const videoCallEnums_1 = require("../../domain/enum/videoCallEnums");
const membershipEnums_1 = require("../../domain/enum/membershipEnums");
const WalletTransactionType_1 = require("../../domain/enum/WalletTransactionType");
class DashboardRepository {
    constructor(_userModel, _videoCallModel, _walletModel, _membershipModel) {
        this._userModel = _userModel;
        this._videoCallModel = _videoCallModel;
        this._walletModel = _walletModel;
        this._membershipModel = _membershipModel;
    }
    getStats() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const [totalUsers, totalTrainers, totalSessions, totalMemberships, activeMemberships, completedSessions, missedSessions, cancelledSessions, revenueData,] = yield Promise.all([
                this._userModel.countDocuments({ role: userEnums_1.UserRole.USER }),
                this._userModel.countDocuments({ role: userEnums_1.UserRole.TRAINER }),
                this._videoCallModel.countDocuments(),
                this._membershipModel.countDocuments(),
                this._membershipModel.countDocuments({ status: membershipEnums_1.MembershipStatus.Active }),
                this._videoCallModel.countDocuments({ status: videoCallEnums_1.VideoCallStatus.COMPLETED }),
                this._videoCallModel.countDocuments({ status: videoCallEnums_1.VideoCallStatus.MISSED }),
                this._videoCallModel.countDocuments({ status: videoCallEnums_1.VideoCallStatus.CANCELLED }),
                this._walletModel.aggregate([
                    { $match: { ownerType: 'admin' } },
                    { $unwind: '$transactions' },
                    { $match: { 'transactions.type': WalletTransactionType_1.WalletTransactionType.PLATFORM_FEE } },
                    { $group: { _id: null, total: { $sum: '$transactions.amount' } } },
                ]),
            ]);
            return {
                totalUsers,
                totalTrainers,
                totalSessions,
                totalMemberships,
                activeMemberships,
                completedSessions,
                missedSessions,
                cancelledSessions,
                platformRevenue: ((_a = revenueData[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
            };
        });
    }
    getChartData(period) {
        return __awaiter(this, void 0, void 0, function* () {
            const { startDate, groupFormat, labels, dateKeys } = this.getPeriodConfig(period);
            const [revenueChart, userGrowthChart, trainerGrowthChart, sessionStatusChart, membershipChart] = yield Promise.all([
                this.getRevenueChart(startDate, groupFormat, labels, dateKeys),
                this.getUserGrowthChart(startDate, groupFormat, labels, dateKeys),
                this.getTrainerGrowthChart(startDate, groupFormat, labels, dateKeys), // ← add
                this.getSessionStatusChart(),
                this.getMembershipChart(startDate, groupFormat, labels, dateKeys),
            ]);
            return { revenueChart, userGrowthChart, trainerGrowthChart, sessionStatusChart, membershipChart };
        });
    }
    getTrainerGrowthChart(startDate, groupFormat, labels, dateKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._userModel.aggregate([
                { $match: { role: userEnums_1.UserRole.TRAINER, createdAt: { $gte: startDate } } },
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
    getPeriodConfig(period) {
        const now = new Date();
        let startDate;
        let groupFormat;
        let labels;
        let dateKeys; // ← actual keys that MongoDB will return
        switch (period) {
            case 'daily':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 6);
                startDate.setHours(0, 0, 0, 0);
                groupFormat = '%Y-%m-%d';
                labels = [];
                dateKeys = [];
                for (let i = 6; i >= 0; i--) {
                    const d = new Date(now);
                    d.setDate(now.getDate() - i);
                    // label shown in chart
                    labels.push(d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }));
                    // key MongoDB returns e.g. "2026-02-26"
                    dateKeys.push(d.toISOString().split('T')[0]);
                }
                break;
            case 'weekly':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 55);
                startDate.setHours(0, 0, 0, 0);
                groupFormat = '%Y-%U';
                labels = [];
                dateKeys = [];
                for (let i = 7; i >= 0; i--) {
                    const weekEnd = new Date(now);
                    weekEnd.setDate(now.getDate() - (i * 7)); // ← end of this week slot
                    const weekStart = new Date(weekEnd);
                    weekStart.setDate(weekEnd.getDate() - 6); // ← start is 6 days before end
                    // ✅ Cap weekEnd to today — never show future dates
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
                labels = [];
                dateKeys = [];
                for (let i = 11; i >= 0; i--) {
                    const d = new Date(now);
                    d.setMonth(now.getMonth() - i);
                    labels.push(d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }));
                    // key MongoDB returns e.g. "2026-02"
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
                labels = [];
                dateKeys = [];
                for (let i = 2; i >= 0; i--) {
                    const year = String(now.getFullYear() - i);
                    labels.push(year);
                    dateKeys.push(year);
                }
                break;
        }
        return { startDate, groupFormat, labels, dateKeys };
    }
    getRevenueChart(startDate, groupFormat, labels, dateKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._walletModel.aggregate([
                { $match: { ownerType: 'admin' } },
                { $unwind: '$transactions' },
                {
                    $match: {
                        'transactions.type': WalletTransactionType_1.WalletTransactionType.PLATFORM_FEE,
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
            return this.fillMissingLabels(labels, dateKeys, result); // ← pass dateKeys
        });
    }
    getUserGrowthChart(startDate, groupFormat, labels, dateKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._userModel.aggregate([
                { $match: { role: userEnums_1.UserRole.USER, createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
                        value: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]);
            return this.fillMissingLabels(labels, dateKeys, result); // ← pass dateKeys
        });
    }
    getSessionStatusChart() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._videoCallModel.aggregate([{ $group: { _id: '$status', value: { $sum: 1 } } }]);
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
    getMembershipChart(startDate, groupFormat, labels, dateKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._membershipModel.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
                        value: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]);
            return this.fillMissingLabels(labels, dateKeys, result); // ← pass dateKeys
        });
    }
    // Fill in 0 for missing periods
    fillMissingLabels(labels, dateKeys, // ← actual date keys matching the labels
    data) {
        const dataMap = new Map(data.map(item => [item._id, item.value]));
        return labels.map((label, index) => ({
            label,
            value: dataMap.get(dateKeys[index]) || 0, // ← match by date key
        }));
    }
}
exports.DashboardRepository = DashboardRepository;
