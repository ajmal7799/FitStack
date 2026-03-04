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
exports.AdminSessionController = void 0;
const error_1 = require("../../../shared/constants/error");
const messages_1 = require("../../../shared/constants/messages");
const responseHelper_1 = require("../../../shared/utils/responseHelper");
const exceptions_1 = require("../../../application/constants/exceptions");
class AdminSessionController {
    constructor(_sessionHistoryUseCase, _sessionAdminHistoryUseCase) {
        this._sessionHistoryUseCase = _sessionHistoryUseCase;
        this._sessionAdminHistoryUseCase = _sessionAdminHistoryUseCase;
    }
    getAllSessions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const status = req.query.status || undefined;
                const search = req.query.search || undefined;
                if (page < 1 || limit < 1 || limit > 100) {
                    throw new exceptions_1.InvalidDataException(error_1.Errors.INVALID_PAGINATION_PARAMETERS);
                }
                const result = yield this._sessionHistoryUseCase.getSessionHistory(page, limit, status, search);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.USERS.SESSION_HISTORY_FETCHED_SUCCESS, { result }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getSessionDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sessionId } = req.params;
                if (!sessionId) {
                    throw new exceptions_1.InvalidDataException(error_1.Errors.INVALID_DATA);
                }
                const result = yield this._sessionAdminHistoryUseCase.getSessionHistoryDetails(sessionId);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.USERS.SESSION_HISTORY_DETAILS_FETCHED_SUCCESS, { result }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AdminSessionController = AdminSessionController;
