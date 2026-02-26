// hooks/admin/useDashboard.ts
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats, getDashboardCharts } from '../../service/admin/dashboardService';

export const useGetDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: getDashboardStats,
    });
};

export const useGetDashboardCharts = (period: string) => {
    return useQuery({
        queryKey: ['dashboard-charts', period],
        queryFn: () => getDashboardCharts(period),
    });
};