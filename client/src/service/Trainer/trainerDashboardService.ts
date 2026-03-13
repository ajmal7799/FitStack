// service/trainer/trainerDashboardService.ts
import AxiosInstance from '../../axios/axios';
import { API_ROUTES } from '../../constants/apiRoutes';

export const getTrainerDashboardStats = async () => {
  const response = await AxiosInstance.get(API_ROUTES.TRAINER.GET_DASHBOARD);
  return response.data.data;
};

export const getTrainerDashboardCharts = async (period: string) => {
  const response = await AxiosInstance.get(`${API_ROUTES.TRAINER.GET_DASHBOARD_CHARTS}?period=${period}`);
  return response.data.data;
};