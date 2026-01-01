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
exports.GenerateDietPlanUseCase = void 0;
const exceptions_1 = require("../../constants/exceptions");
const error_1 = require("../../../shared/constants/error");
class GenerateDietPlanUseCase {
    constructor(_userProfileRepository, _dietPlanProviderService, _dietPlanRepository) {
        this._userProfileRepository = _userProfileRepository;
        this._dietPlanProviderService = _dietPlanProviderService;
        this._dietPlanRepository = _dietPlanRepository;
    }
    generateDietPlan(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userProfile = yield this._userProfileRepository.findByUserId(userId);
            if (!userProfile) {
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.USER_PROFILE_NOT_FOUND);
            }
            const plan = yield this._dietPlanProviderService.generateDietPlan(userProfile);
            if (!plan) {
                throw new exceptions_1.InvalidDataException(error_1.USER_ERRORS.USER_GENERATE_DIET_PLAN_FAILED);
            }
            const dietPlan = yield this._dietPlanRepository.saveDietPlan(userId, plan);
            if (!dietPlan) {
                throw new exceptions_1.InvalidDataException(error_1.USER_ERRORS.USER_GENERATE_DIET_PLAN_FAILED);
            }
            return {
                dietPlan,
            };
        });
    }
}
exports.GenerateDietPlanUseCase = GenerateDietPlanUseCase;
