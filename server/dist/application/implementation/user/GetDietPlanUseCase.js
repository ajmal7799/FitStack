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
exports.GetDietPlanUseCase = void 0;
const error_1 = require("../../../shared/constants/error");
const exceptions_1 = require("../../constants/exceptions");
const dietPlanMappers_1 = require("../../mappers/dietPlanMappers");
class GetDietPlanUseCase {
    constructor(_userRepository, _dietPlanRepository) {
        this._userRepository = _userRepository;
        this._dietPlanRepository = _dietPlanRepository;
    }
    excute(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findById(userId);
            if (!user) {
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.USER_NOT_FOUND);
            }
            const dietPlan = yield this._dietPlanRepository.findByUserId(userId);
            if (!dietPlan) {
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.USER_DIET_PLAN_NOT_FOUND);
            }
            return dietPlanMappers_1.DietPlanMapper.toResponseDTO(dietPlan);
        });
    }
}
exports.GetDietPlanUseCase = GetDietPlanUseCase;
