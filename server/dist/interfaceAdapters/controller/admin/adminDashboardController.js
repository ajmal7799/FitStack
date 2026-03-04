"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDashboardController = void 0;
const responseHelper_1 = require("../../../shared/utils/responseHelper");
class AdminDashboardController {
    constructor(_getDashboardUseCase) {
        this._getDashboardUseCase = _getDashboardUseCase;
    }
    getStats(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stats = yield this._getDashboardUseCase.getStats();
                responseHelper_1.ResponseHelper.success(res, 'Dashboard stats fetched', stats, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getChartData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const period = req.query.period || 'monthly';
                const chartData = yield this._getDashboardUseCase.getChartData(period);
                responseHelper_1.ResponseHelper.success(res, 'Chart data fetched', chartData, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AdminDashboardController = AdminDashboardController;
