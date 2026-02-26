// interfaceAdapters/controller/trainer/trainerDashboardController.ts
import { Request, Response, NextFunction } from 'express';
import { GetTrainerDashboardUseCase } from '../../../application/implementation/trainer/dashboard/GetTrainerDashboardUseCase';
import { ResponseHelper } from '../../../shared/utils/responseHelper';
import { HTTPStatus } from '../../../shared/constants/httpStatus';
import { TrainerFilterPeriod } from '../../../domain/entities/trainer/trainerDashboardEntities';

export class TrainerDashboardController {
    constructor(private _getTrainerDashboardUseCase: GetTrainerDashboardUseCase) {}

    async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const trainerId = req.user?.userId!;
            const stats = await this._getTrainerDashboardUseCase.getStats(trainerId);
             ResponseHelper.success(res, 'Trainer dashboard stats fetched', stats, HTTPStatus.OK);
        } catch (error) {
            next(error);
        }
    }

    async getChartData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const trainerId = req.user?.userId!;
            const period = (req.query.period as TrainerFilterPeriod) || 'monthly';
            const chartData = await this._getTrainerDashboardUseCase.getChartData(trainerId, period);
             ResponseHelper.success(res, 'Trainer chart data fetched', chartData, HTTPStatus.OK);
        } catch (error) {
            next(error);
        }
    }
}