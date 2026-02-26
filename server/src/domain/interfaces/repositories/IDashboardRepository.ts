import { DashboardStats, DashboardChartData, FilterPeriod } from '../../entities/admin/dashboardEntities';

export interface IDashboardRepository {
    getStats(): Promise<DashboardStats>;
    getChartData(period: FilterPeriod): Promise<DashboardChartData>;
}