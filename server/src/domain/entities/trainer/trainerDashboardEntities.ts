// domain/entities/trainer/trainerDashboardEntities.ts
export interface TrainerDashboardStats {
    totalEarnings: number;
    thisMonthEarnings: number;
    lastMonthEarnings: number;
    totalSessions: number;
    completedSessions: number;
    missedSessions: number;
    cancelledSessions: number;
    totalClients: number;
    averageRating: number;
    totalRatings: number;
}

export interface TrainerChartDataPoint {
    label: string;
    value: number;
}

export interface TopRatedSession {
    sessionId: string;
    userName: string;
    userAvatar: string;
    rating: number;
    review: string;
    date: string;
}

export interface TrainerDashboardChartData {
    earningsChart: TrainerChartDataPoint[];
    sessionStatusChart: TrainerChartDataPoint[];
    clientGrowthChart: TrainerChartDataPoint[];
    topRatedSessions: TopRatedSession[];
}

export type TrainerFilterPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';