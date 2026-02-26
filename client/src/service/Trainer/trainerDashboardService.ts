// service/trainer/trainerDashboardService.ts
import AxiosInstance from '../../axios/axios';

export const getTrainerDashboardStats = async () => {
    const response = await AxiosInstance.get('/trainer/dashboard/stats');
    return response.data.data;
};

export const getTrainerDashboardCharts = async (period: string) => {
    const response = await AxiosInstance.get(`/trainer/dashboard/charts?period=${period}`);
    return response.data.data;
};