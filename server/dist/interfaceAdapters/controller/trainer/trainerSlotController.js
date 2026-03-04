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
exports.TrainerSlotController = void 0;
const error_1 = require("../../../shared/constants/error");
const responseHelper_1 = require("../../../shared/utils/responseHelper");
const messages_1 = require("../../../shared/constants/messages");
const exceptions_1 = require("../../../application/constants/exceptions");
const slotCreationValidator_1 = require("../../../shared/validations/slotCreationValidator");
const recurringSlotValidatior_1 = require("../../../shared/validations/recurringSlotValidatior");
class TrainerSlotController {
    constructor(_createSlotUseCase, _getAllSlotsUseCase, _deleteSlotUseCase, _recurringSlotUseCase, _bookedSlotsUseCase, _bookedSlotDetailsUseCase, _sessionHistoryUseCase, _sessionHistoryDetailsUseCase) {
        this._createSlotUseCase = _createSlotUseCase;
        this._getAllSlotsUseCase = _getAllSlotsUseCase;
        this._deleteSlotUseCase = _deleteSlotUseCase;
        this._recurringSlotUseCase = _recurringSlotUseCase;
        this._bookedSlotsUseCase = _bookedSlotsUseCase;
        this._bookedSlotDetailsUseCase = _bookedSlotDetailsUseCase;
        this._sessionHistoryUseCase = _sessionHistoryUseCase;
        this._sessionHistoryDetailsUseCase = _sessionHistoryDetailsUseCase;
    }
    // --------------------------------------------------
    //              🛠 CREATE SLOTS
    // --------------------------------------------------
    createSlot(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                console.log(user);
                if (!user) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                const parseResult = slotCreationValidator_1.slotCreationSchema.safeParse(req.body);
                if (!parseResult.success) {
                    const errorMessage = ((_b = parseResult.error.issues[0]) === null || _b === void 0 ? void 0 : _b.message) || 'Invalid data';
                    throw new exceptions_1.InvalidDataException(errorMessage);
                }
                const result = yield this._createSlotUseCase.createSlot(user, parseResult.data.startTime);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.Trainer.SLOT_CREATED_SUCCESS, { result }, 201 /* HTTPStatus.CREATED */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // --------------------------------------------------
    //              🛠 GET ALL SLOTS
    // --------------------------------------------------
    getAllSlots(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const trainerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 5;
                const status = req.query.status || undefined;
                if (!trainerId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                if (page < 1 || limit < 1 || limit > 100) {
                    throw new exceptions_1.InvalidDataException(error_1.Errors.INVALID_PAGINATION_PARAMETERS);
                }
                const result = yield this._getAllSlotsUseCase.getAllSlots(trainerId, page, limit, status);
                if (!result || !result.slots || result.slots.length === 0) {
                    responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.Trainer.SLOTS_FETCHED_SUCCESS, { result }, 200 /* HTTPStatus.OK */);
                }
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.Trainer.SLOTS_FETCHED_SUCCESS, { result }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // --------------------------------------------------
    //              🛠 DELETE SLOT
    // --------------------------------------------------
    deleteSlot(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const trainerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const { slotId } = req.params;
                if (!trainerId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                if (!slotId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                yield this._deleteSlotUseCase.deleteSlot(slotId, trainerId);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.Trainer.SLOT_DELETED_SUCCESS, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // --------------------------------------------------
    //              🛠 RECURRING SLOT CREATION
    // --------------------------------------------------
    createRecurringSlot(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const trainerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!trainerId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                const parseResult = recurringSlotValidatior_1.recurringSlotSchema.safeParse(req.body);
                if (parseResult.error) {
                    throw new exceptions_1.InvalidDataException(error_1.Errors.INVALID_DATA);
                }
                const result = yield this._recurringSlotUseCase.createRecurringSlot(trainerId, parseResult.data);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.Trainer.SLOT_CREATED_SUCCESS, { result }, 201 /* HTTPStatus.CREATED */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getBookedSlots(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const trainerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const status = req.query.status || undefined;
                const search = req.query.search || undefined;
                if (!trainerId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                const result = yield this._bookedSlotsUseCase.getBookedSlots(trainerId, page, limit, status, search);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.Trainer.BOOKED_SLOTS_FETCHED_SUCCESS, { result }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getBookedSlotDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const trainerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const { slotId } = req.params;
                if (!trainerId || !slotId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                const result = yield this._bookedSlotDetailsUseCase.getBookedSlotDetails(trainerId, slotId);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.Trainer.BOOKED_SLOT_DETAILS_FETCHED_SUCCESS, { result }, 200 /* HTTPStatus.OK */);
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
                const trainerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const search = req.query.search || undefined;
                if (!trainerId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                const result = yield this._sessionHistoryUseCase.getTrainerSessionHistory(trainerId, page, limit, search);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.Trainer.SESSION_HISTORY_FETCHED_SUCCESS, { result }, 200 /* HTTPStatus.OK */);
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
                const trainerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const { sessionId } = req.params;
                if (!trainerId || !sessionId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                const result = yield this._sessionHistoryDetailsUseCase.getTrainerSessionHistoryDetails(trainerId, sessionId);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.Trainer.SESSION_HISTORY_DETAILS_FETCHED_SUCCESS, { result }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.TrainerSlotController = TrainerSlotController;
