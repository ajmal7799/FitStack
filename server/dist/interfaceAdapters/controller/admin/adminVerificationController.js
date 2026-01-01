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
exports.AdminVerificationController = void 0;
const error_1 = require("../../../shared/constants/error");
const messages_1 = require("../../../shared/constants/messages");
const responseHelper_1 = require("../../../shared/utils/responseHelper");
const exceptions_1 = require("../../../application/constants/exceptions");
class AdminVerificationController {
    constructor(_getAllVerificationUseCase, _getVerificationDetailsPage, _verificationApproveUseCase, _verificationRejectUseCase) {
        this._getAllVerificationUseCase = _getAllVerificationUseCase;
        this._getVerificationDetailsPage = _getVerificationDetailsPage;
        this._verificationApproveUseCase = _verificationApproveUseCase;
        this._verificationRejectUseCase = _verificationRejectUseCase;
    }
    // --------------------------------------------------
    //              🛠 GET ALL VERIFICATION LIST
    // --------------------------------------------------
    getAllTrainerVerificationData(req, res, next) {
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
                const result = yield this._getAllVerificationUseCase.getAllVerification(page, limit, status, search);
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
    // --------------------------------------------------
    //              🛠 VERIFICATION DETAILS PAGE
    // --------------------------------------------------
    getVerificationDetailsPage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trainerId = req.params.trainerId;
                if (!trainerId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                const verificationData = yield this._getVerificationDetailsPage.execute(trainerId);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.Trainer.VERIFICATION_APPROVED, { verificationData }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // --------------------------------------------------
    //              🛠 VERIFICATION APPRVOE 
    // --------------------------------------------------
    approveVerification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trainerId = req.params.trainerId;
                if (!trainerId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                const verificationData = yield this._verificationApproveUseCase.execute(trainerId);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.Trainer.VERIFICATION_REJECTED, { verificationData }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // --------------------------------------------------
    //              🛠 VERIFICATION REJECT WITH REASON
    // --------------------------------------------------
    rejectVerification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trainerId = req.params.trainerId;
                if (!trainerId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                const reason = req.body.reason;
                if (!reason) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                const verificationData = yield this._verificationRejectUseCase.execute(trainerId, reason);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.Trainer.VERIFICATION_DATA_SUCCESS, { verificationData }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AdminVerificationController = AdminVerificationController;
