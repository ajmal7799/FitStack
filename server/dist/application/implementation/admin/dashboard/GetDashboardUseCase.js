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
exports.GetDashboardUseCase = void 0;
class GetDashboardUseCase {
    constructor(_dashboardRepository) {
        this._dashboardRepository = _dashboardRepository;
    }
    getStats() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._dashboardRepository.getStats();
        });
    }
    getChartData(period) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._dashboardRepository.getChartData(period);
        });
    }
}
exports.GetDashboardUseCase = GetDashboardUseCase;
