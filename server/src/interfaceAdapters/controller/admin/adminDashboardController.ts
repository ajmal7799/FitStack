// interfaceAdapters/controller/admin/adminDashboardController.ts
import { Request, Response, NextFunction } from 'express';
import { GetDashboardUseCase } from '../../../application/implementation/admin/dashboard/GetDashboardUseCase';
import { ResponseHelper } from '../../../shared/utils/responseHelper';
import { HTTPStatus } from '../../../shared/constants/httpStatus';
import { FilterPeriod } from '../../../domain/entities/admin/dashboardEntities';

export class AdminDashboardController {
    constructor(private _getDashboardUseCase: GetDashboardUseCase) {}

    async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const stats = await this._getDashboardUseCase.getStats();
             ResponseHelper.success(res, 'Dashboard stats fetched', stats, HTTPStatus.OK);
        } catch (error) {
            next(error);
        }
    }

    async getChartData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const period = (req.query.period as FilterPeriod) || 'monthly';
            const chartData = await this._getDashboardUseCase.getChartData(period);
             ResponseHelper.success(res, 'Chart data fetched', chartData, HTTPStatus.OK);
        } catch (error) {
            next(error);
        }
    }
}