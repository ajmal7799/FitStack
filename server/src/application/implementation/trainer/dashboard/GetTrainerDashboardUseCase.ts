// application/implementation/trainer/dashboard/GetTrainerDashboardUseCase.ts
import { ITrainerDashboardRepository } from '../../../../domain/interfaces/repositories/ITrainerDashboardRepository';
import { TrainerFilterPeriod } from '../../../../domain/entities/trainer/trainerDashboardEntities';

export class GetTrainerDashboardUseCase {
    constructor(private _trainerDashboardRepository: ITrainerDashboardRepository) {}

    async getStats(trainerId: string) {
        return this._trainerDashboardRepository.getStats(trainerId);
    }

    async getChartData(trainerId: string, period: TrainerFilterPeriod) {
        return this._trainerDashboardRepository.getChartData(trainerId, period);
    }
}