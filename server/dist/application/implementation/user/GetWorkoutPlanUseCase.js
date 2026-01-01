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
exports.GetWorkoutPlanUseCase = void 0;
const error_1 = require("../../../shared/constants/error");
const exceptions_1 = require("../../constants/exceptions");
const workouPlanMappers_1 = require("../../mappers/workouPlanMappers");
class GetWorkoutPlanUseCase {
    constructor(_workoutPlanRepository, _userRepository) {
        this._workoutPlanRepository = _workoutPlanRepository;
        this._userRepository = _userRepository;
    }
    execute(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findById(userId);
            if (!user) {
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.USER_NOT_FOUND);
            }
            const workoutPlan = yield this._workoutPlanRepository.findByUserId(userId);
            if (!workoutPlan) {
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.USER_WORKOUT_PLAN_NOT_FOUND);
            }
            return workouPlanMappers_1.WorkoutPlanMapper.toResponseDto(workoutPlan);
        });
    }
}
exports.GetWorkoutPlanUseCase = GetWorkoutPlanUseCase;
