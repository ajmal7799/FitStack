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
exports.UserTrainerController = void 0;
const messages_1 = require("../../../shared/constants/messages");
const responseHelper_1 = require("../../../shared/utils/responseHelper");
const exceptions_1 = require("../../../application/constants/exceptions");
const error_1 = require("../../../shared/constants/error");
class UserTrainerController {
    constructor(_getAllTrainerUseCase, _getTrainerDetailsUseCase, _trainerSelectUseCase, _getSelectedTrainerUseCase) {
        this._getAllTrainerUseCase = _getAllTrainerUseCase;
        this._getTrainerDetailsUseCase = _getTrainerDetailsUseCase;
        this._trainerSelectUseCase = _trainerSelectUseCase;
        this._getSelectedTrainerUseCase = _getSelectedTrainerUseCase;
    }
    getAllTrainer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const search = req.query.search || undefined;
                if (page < 1 || limit < 1 || limit > 100) {
                    throw new exceptions_1.InvalidDataException(error_1.Errors.INVALID_PAGINATION_PARAMETERS);
                }
                const result = yield this._getAllTrainerUseCase.getAllTrainer(page, limit, search);
                if (!result || ((_a = result.verifications) === null || _a === void 0 ? void 0 : _a.length) === 0) {
                    throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.NO_USERS_FOUND);
                }
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.Trainer.VERIFICATION_DATA_SUCCESS, { data: result }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getTrainerDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { trainerId } = req.params;
                if (!trainerId) {
                    throw new exceptions_1.InvalidDataException(error_1.Errors.INVALID_DATA);
                }
                const result = yield this._getTrainerDetailsUseCase.getTrainerDetails(trainerId);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.Trainer.TRAINER_DETAILS_SUCCESS, { result }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    selectTrainer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const { trainerId } = req.body;
                if (!userId || !trainerId) {
                    throw new exceptions_1.InvalidDataException(error_1.Errors.INVALID_DATA);
                }
                yield this._trainerSelectUseCase.selectTrainer(userId, trainerId);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.Trainer.TRAINER_SELECTED_SUCCESS, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getSelectedTrainer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    throw new exceptions_1.InvalidDataException(error_1.Errors.INVALID_DATA);
                }
                const result = yield this._getSelectedTrainerUseCase.getSelectedTrainer(userId);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.Trainer.GET_SELECTED_TRAINER, { result }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.UserTrainerController = UserTrainerController;
