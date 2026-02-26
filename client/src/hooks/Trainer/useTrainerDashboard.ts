import { useQuery } from '@tanstack/react-query';
import { getTrainerDashboardStats,getTrainerDashboardCharts } from '../../service/Trainer/trainerDashboardService';

export const useGetTrainerDashboardStats = () => {
    return useQuery({
        queryKey: ['trainer-dashboard-stats'],
        queryFn: getTrainerDashboardStats,
    });
};

export const useGetTrainerDashboardCharts = (period: string) => {
    return useQuery({
        queryKey: ['trainer-dashboard-charts', period],
        queryFn: () => getTrainerDashboardCharts(period),
    });
};