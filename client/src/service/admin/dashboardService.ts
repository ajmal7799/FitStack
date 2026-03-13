// service/admin/dashboardService.ts
import AxiosInstance from '../../axios/axios';
import { API_ROUTES } from '../../constants/apiRoutes';

export const getDashboardStats = async () => {
  const response = await AxiosInstance.get(API_ROUTES.ADMIN.GET_DASHBOARD);
  return response.data.data;
}; 
export const getDashboardCharts = async (period: string) => {
  const response = await AxiosInstance.get(`${API_ROUTES.ADMIN.GET_DASHBOARD_CHARTS}?period=${period}`);
  return response.data.data;
};
