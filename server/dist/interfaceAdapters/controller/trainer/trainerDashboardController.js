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
exports.TrainerDashboardController = void 0;
const responseHelper_1 = require("../../../shared/utils/responseHelper");
class TrainerDashboardController {
    constructor(_getTrainerDashboardUseCase) {
        this._getTrainerDashboardUseCase = _getTrainerDashboardUseCase;
    }
    getStats(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const trainerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const stats = yield this._getTrainerDashboardUseCase.getStats(trainerId);
                responseHelper_1.ResponseHelper.success(res, 'Trainer dashboard stats fetched', stats, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getChartData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const trainerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const period = req.query.period || 'monthly';
                const chartData = yield this._getTrainerDashboardUseCase.getChartData(trainerId, period);
                responseHelper_1.ResponseHelper.success(res, 'Trainer chart data fetched', chartData, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.TrainerDashboardController = TrainerDashboardController;
