// infrastructure/repositories/dashboardRepository.ts
import { Model } from 'mongoose';
import { IDashboardRepository } from '../../domain/interfaces/repositories/IDashboardRepository';
import {
  DashboardStats,
  DashboardChartData,
  FilterPeriod,
  ChartDataPoint,
} from '../../domain/entities/admin/dashboardEntities';
import { IUserModel } from '../database/models/userModel';
import { IVideoCallModel } from '../database/models/videoCallModel';
import { IWalletModel } from '../database/models/walletModel';
import { IMembershipModel } from '../database/models/membershipModel';
import { UserRole } from '../../domain/enum/userEnums';
import { VideoCallStatus } from '../../domain/enum/videoCallEnums';
import { MembershipStatus } from '../../domain/enum/membershipEnums';
import { WalletTransactionType } from '../../domain/enum/WalletTransactionType';

export class DashboardRepository implements IDashboardRepository {
  constructor(
    private _userModel: Model<IUserModel>,
    private _videoCallModel: Model<IVideoCallModel>,
    private _walletModel: Model<IWalletModel>,
    private _membershipModel: Model<IMembershipModel>
  ) {}

  async getStats(): Promise<DashboardStats> {
    const [
      totalUsers,
      totalTrainers,
      totalSessions,
      totalMemberships,
      activeMemberships,
      completedSessions,
      missedSessions,
      cancelledSessions,
      revenueData,
    ] = await Promise.all([
      this._userModel.countDocuments({ role: UserRole.USER }),
      this._userModel.countDocuments({ role: UserRole.TRAINER }),
      this._videoCallModel.countDocuments(),
      this._membershipModel.countDocuments(),
      this._membershipModel.countDocuments({ status: MembershipStatus.Active }),
      this._videoCallModel.countDocuments({ status: VideoCallStatus.COMPLETED }),
      this._videoCallModel.countDocuments({ status: VideoCallStatus.MISSED }),
      this._videoCallModel.countDocuments({ status: VideoCallStatus.CANCELLED }),
      this._walletModel.aggregate([
        { $match: { ownerType: 'admin' } },
        { $unwind: '$transactions' },
        { $match: { 'transactions.type': WalletTransactionType.PLATFORM_FEE } },
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
      platformRevenue: revenueData[0]?.total || 0,
    };
  }

  async getChartData(period: FilterPeriod): Promise<DashboardChartData> {
    const { startDate, groupFormat, labels, dateKeys } = this.getPeriodConfig(period);

    const [revenueChart, userGrowthChart, trainerGrowthChart, sessionStatusChart, membershipChart] = await Promise.all([
      this.getRevenueChart(startDate, groupFormat, labels, dateKeys),
      this.getUserGrowthChart(startDate, groupFormat, labels, dateKeys),
      this.getTrainerGrowthChart(startDate, groupFormat, labels, dateKeys), // ← add
      this.getSessionStatusChart(),
      this.getMembershipChart(startDate, groupFormat, labels, dateKeys),
    ]);

    return { revenueChart, userGrowthChart, trainerGrowthChart, sessionStatusChart, membershipChart };
  }
  private async getTrainerGrowthChart(
    startDate: Date,
    groupFormat: string,
    labels: string[],
    dateKeys: string[]
  ): Promise<ChartDataPoint[]> {
    const result = await this._userModel.aggregate([
      { $match: { role: UserRole.TRAINER, createdAt: { $gte: startDate } } },
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

  private getPeriodConfig(period: FilterPeriod) {
    const now = new Date();
    let startDate: Date;
    let groupFormat: string;
    let labels: string[];
    let dateKeys: string[]; // ← actual keys that MongoDB will return

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
        const weekNum = Math.floor(
            ((weekStart.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7
        );
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

  private async getRevenueChart(
    startDate: Date,
    groupFormat: string,
    labels: string[],
    dateKeys: string[]
  ): Promise<ChartDataPoint[]> {
    const result = await this._walletModel.aggregate([
      { $match: { ownerType: 'admin' } },
      { $unwind: '$transactions' },
      {
        $match: {
          'transactions.type': WalletTransactionType.PLATFORM_FEE,
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
  }

  private async getUserGrowthChart(
    startDate: Date,
    groupFormat: string,
    labels: string[],
    dateKeys: string[]
  ): Promise<ChartDataPoint[]> {
    const result = await this._userModel.aggregate([
      { $match: { role: UserRole.USER, createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
          value: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return this.fillMissingLabels(labels, dateKeys, result); // ← pass dateKeys
  }
  private async getSessionStatusChart(): Promise<ChartDataPoint[]> {
    const result = await this._videoCallModel.aggregate([{ $group: { _id: '$status', value: { $sum: 1 } } }]);

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

  private async getMembershipChart(
    startDate: Date,
    groupFormat: string,
    labels: string[],
    dateKeys: string[]
  ): Promise<ChartDataPoint[]> {
    const result = await this._membershipModel.aggregate([
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
  }

  // Fill in 0 for missing periods
  private fillMissingLabels(
    labels: string[],
    dateKeys: string[], // ← actual date keys matching the labels
    data: { _id: string; value: number }[]
  ): ChartDataPoint[] {
    const dataMap = new Map(data.map(item => [item._id, item.value]));

    return labels.map((label, index) => ({
      label,
      value: dataMap.get(dateKeys[index]) || 0, // ← match by date key
    }));
  }
}
