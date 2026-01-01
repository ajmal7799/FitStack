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
exports.AdminTrainerController = void 0;
const error_1 = require("../../../shared/constants/error");
const messages_1 = require("../../../shared/constants/messages");
const responseHelper_1 = require("../../../shared/utils/responseHelper");
const exceptions_1 = require("../../../application/constants/exceptions");
class AdminTrainerController {
    constructor(_getAllTrainerUseCase, _updateTrainerStatusUseCase) {
        this._getAllTrainerUseCase = _getAllTrainerUseCase;
        this._updateTrainerStatusUseCase = _updateTrainerStatusUseCase;
    }
    // --------------------------------------------------
    //               LISTING ALL TRAINER
    // --------------------------------------------------
    getAllTrainer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const status = req.query.status || undefined;
                const search = req.query.search || undefined;
                if (page < 1 || limit < 1 || limit > 100) {
                    throw new exceptions_1.InvalidDataException(error_1.Errors.INVALID_PAGINATION_PARAMETERS);
                }
                const result = yield this._getAllTrainerUseCase.getAllTrainer(page, limit, status, search);
                if (!result || ((_a = result.users) === null || _a === void 0 ? void 0 : _a.length) === 0) {
                    throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.NO_USERS_FOUND);
                }
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.USERS.GET_ALL_USERS, { data: result }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // --------------------------------------------------
    //               CHANGE TRAINER STATUS
    // --------------------------------------------------
    updateTrainerStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, currentStatus } = req.body;
                if (!userId || !currentStatus) {
                    throw new exceptions_1.InvalidDataException(error_1.Errors.INVALID_CREDENTIALS);
                }
                const result = yield this._updateTrainerStatusUseCase.updateTrainerStatus(userId, currentStatus);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.USERS.STATUS_UPDATED_SUCCESSFULLY, { data: result.user }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AdminTrainerController = AdminTrainerController;
