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
exports.UserBookingSlotController = void 0;
const error_1 = require("../../../shared/constants/error");
const responseHelper_1 = require("../../../shared/utils/responseHelper");
const messages_1 = require("../../../shared/constants/messages");
const exceptions_1 = require("../../../application/constants/exceptions");
const DateCheckerValidator_1 = require("../../../shared/validations/DateCheckerValidator");
class UserBookingSlotController {
    constructor(_getAllAvailableSlotUseCase, _bookSlotUseCase, _bookedSlotUseCase, _bookedSlotDetailsUseCase, _bookedSlotCancelUseCase, _sessionHistoryUseCase, _sessionHistoryDetailsUseCase) {
        this._getAllAvailableSlotUseCase = _getAllAvailableSlotUseCase;
        this._bookSlotUseCase = _bookSlotUseCase;
        this._bookedSlotUseCase = _bookedSlotUseCase;
        this._bookedSlotDetailsUseCase = _bookedSlotDetailsUseCase;
        this._bookedSlotCancelUseCase = _bookedSlotCancelUseCase;
        this._sessionHistoryUseCase = _sessionHistoryUseCase;
        this._sessionHistoryDetailsUseCase = _sessionHistoryDetailsUseCase;
    }
    getAvailableSlots(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const { date } = DateCheckerValidator_1.getAvailableSlotsSchema.parse(req).query;
                if (!userId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                if (!date) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                const result = yield this._getAllAvailableSlotUseCase.getAvailableSlots(userId, date);
                // if (!result || !result.length) {
                //   ResponseHelper.success(res, MESSAGES.Trainer.TRAINER_NOT_SELECTED_IN_THAT_TIME_SLOT, { result }, HTTPStatus.OK);
                // }
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.Trainer.SLOTS_FETCHED_SUCCESS, { result }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // --------------------------------------------------
    //              🛠 BOOK SLOT
    // --------------------------------------------------
    bookSlot(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const { slotId } = req.params;
                if (!userId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                if (!slotId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                const result = yield this._bookSlotUseCase.bookSlot(userId, slotId);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.USERS.SLOT_CREATED_SUCCESS, { result }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // --------------------------------------------------
    //              🛠 BOOKED SLOTS
    // --------------------------------------------------
    getBookedSlots(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const status = req.query.status || undefined;
                if (!userId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                const result = yield this._bookedSlotUseCase.getBookedSlots(userId, page, limit, status);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.USERS.BOOKED_SLOTS_FETCHED_SUCCESS, { result }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // --------------------------------------------------
    //              🛠 GET BOOKED SLOT DETAILS
    // --------------------------------------------------
    getBookedSlotDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const { slotId } = req.params;
                if (!userId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                if (!slotId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                const result = yield this._bookedSlotDetailsUseCase.getBookedSlotDetails(userId, slotId);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.USERS.BOOKED_SLOT_DETAILS_FETCHED_SUCCESS, { result }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // --------------------------------------------------
    //              🛠 CANCEL BOOKED SLOT
    // --------------------------------------------------
    cancelBookedSlot(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const role = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
                const { slotId } = req.params;
                const reason = (_c = req.body.reason) === null || _c === void 0 ? void 0 : _c.trim();
                console.log('role', role);
                // 1. Initial validation
                if (!userId || !slotId || !reason) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                yield this._bookedSlotCancelUseCase.cancelBookedSlot(userId, slotId, reason, role);
                return responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.USERS.BOOKED_SLOT_CANCELLED_SUCCESS, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // --------------------------------------------------
    //              🛠 SESSION HISTORY
    // --------------------------------------------------
    getSessionHistory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                if (!userId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                const result = yield this._sessionHistoryUseCase.getSessionHistory(userId, page, limit);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.USERS.SESSION_HISTORY_FETCHED_SUCCESS, { result }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // --------------------------------------------------
    //              🛠 SESSION HISTORY DETAILS
    // --------------------------------------------------
    getSessionHistoryDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const { sessionId } = req.params;
                if (!userId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                if (!sessionId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                const result = yield this._sessionHistoryDetailsUseCase.getSessionHistoryDetails(userId, sessionId);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.USERS.SESSION_HISTORY_DETAILS_FETCHED_SUCCESS, { result }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.UserBookingSlotController = UserBookingSlotController;
