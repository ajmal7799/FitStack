// domain/interfaces/repositories/ITrainerDashboardRepository.ts
import { TrainerDashboardStats, TrainerDashboardChartData, TrainerFilterPeriod } from '../../entities/trainer/trainerDashboardEntities';

export interface ITrainerDashboardRepository {
    getStats(trainerId: string): Promise<TrainerDashboardStats>;
    getChartData(trainerId: string, period: TrainerFilterPeriod): Promise<TrainerDashboardChartData>;
}