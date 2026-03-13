// interfaceAdapters/controller/admin/adminDashboardController.ts
import { Request, Response, NextFunction } from 'express';
import { GetDashboardUseCase } from '../../../application/implementation/admin/dashboard/GetDashboardUseCase';
import { ResponseHelper } from '../../../shared/utils/responseHelper';
import { HTTPStatus } from '../../../shared/constants/httpStatus';
import { FilterPeriod } from '../../../domain/entities/admin/dashboardEntities';
import { IGetRevenueListingUseCase } from '../../../application/useCase/admin/revenue/IGetRevenueListingUseCase';

export class AdminDashboardController {
    constructor(private _getDashboardUseCase: GetDashboardUseCase, private _getRevenueListingUseCase: IGetRevenueListingUseCase) {}

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

    // --------------------------------------------------
    //              🛠 REVENUE
    // --------------------------------------------------

  async getRevenueListing(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      const revenueListing = await this._getRevenueListingUseCase.execute(page, limit, search, startDate, endDate);
      ResponseHelper.success(res, 'Revenue listing fetched', revenueListing, HTTPStatus.OK);
    } catch (error) {
      next(error);
    }
  }
}