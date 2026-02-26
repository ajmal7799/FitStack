// application/implementation/admin/dashboard/GetDashboardUseCase.ts
import { IDashboardRepository } from '../../../../domain/interfaces/repositories/IDashboardRepository';
import { DashboardStats, DashboardChartData, FilterPeriod } from '../../../../domain/entities/admin/dashboardEntities';

export class GetDashboardUseCase {
    constructor(private _dashboardRepository: IDashboardRepository) {}

    async getStats(): Promise<DashboardStats> {
        return this._dashboardRepository.getStats();
    }

    async getChartData(period: FilterPeriod): Promise<DashboardChartData> {
        return this._dashboardRepository.getChartData(period);
    }
}