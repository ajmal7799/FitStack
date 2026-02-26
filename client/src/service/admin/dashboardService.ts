// service/admin/dashboardService.ts
import AxiosInstance from '../../axios/axios';

export const getDashboardStats = async () => {
    const response = await AxiosInstance.get('/admin/dashboard/stats');
    return response.data.data;
}; 
export const getDashboardCharts = async (period: string) => {
    const response = await AxiosInstance.get(`/admin/dashboard/charts?period=${period}`);
    return response.data.data;
};