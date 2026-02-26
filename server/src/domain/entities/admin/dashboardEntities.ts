export interface DashboardStats {
    totalUsers: number;
    totalTrainers: number;
    totalSessions: number;
    totalMemberships: number;
    activeMemberships: number;
    completedSessions: number;
    missedSessions: number;
    cancelledSessions: number;
    platformRevenue: number;
}

export interface ChartDataPoint {
    label: string;
    value: number;
}

export interface DashboardChartData {
    revenueChart: ChartDataPoint[];
    userGrowthChart: ChartDataPoint[];
    trainerGrowthChart: ChartDataPoint[]; 
    sessionStatusChart: ChartDataPoint[];
    membershipChart: ChartDataPoint[];
}

export type FilterPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';