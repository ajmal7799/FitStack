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
exports.UserGenerateWorkoutplanController = void 0;
const messages_1 = require("../../../shared/constants/messages");
const responseHelper_1 = require("../../../shared/utils/responseHelper");
const exceptions_1 = require("../../../application/constants/exceptions");
const error_1 = require("../../../shared/constants/error");
class UserGenerateWorkoutplanController {
    constructor(_generateWorkoutplanUseCase, _getWorkoutPlanUseCase) {
        this._generateWorkoutplanUseCase = _generateWorkoutplanUseCase;
        this._getWorkoutPlanUseCase = _getWorkoutPlanUseCase;
    }
    handleGenerateWorkoutplan(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log('reched here ');
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    throw new exceptions_1.InvalidDataException(error_1.USER_ERRORS.NO_USERS_FOUND);
                }
                const result = yield this._generateWorkoutplanUseCase.generateWorkoutPlan(userId);
                console.log('result', result);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.USERS.WORKOUT_PLAN_CREATED_SUCCESSFULLY, { result }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getWorkoutPlan(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log('reched here ');
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.NO_USERS_FOUND);
                }
                const result = yield this._getWorkoutPlanUseCase.execute(userId);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.USERS.GET_WORKOUT_PLAN, { result }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.UserGenerateWorkoutplanController = UserGenerateWorkoutplanController;
