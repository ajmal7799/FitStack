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
exports.AdminSubscriptionController = void 0;
const messages_1 = require("../../../../shared/constants/messages");
const responseHelper_1 = require("../../../../shared/utils/responseHelper");
const exceptions_1 = require("../../../../application/constants/exceptions");
const subscriptionValidator_1 = require("../../../../shared/validations/subscription/subscriptionValidator");
const error_1 = require("../../../../shared/constants/error");
class AdminSubscriptionController {
    constructor(_createSubscriptionUseCase, _getAllSubscriptionUseCase, _updateSubscriptionStatusUseCase, _getSubscriptionEditPageUseCase, _updateSubscriptionUseCase) {
        this._createSubscriptionUseCase = _createSubscriptionUseCase;
        this._getAllSubscriptionUseCase = _getAllSubscriptionUseCase;
        this._updateSubscriptionStatusUseCase = _updateSubscriptionStatusUseCase;
        this._getSubscriptionEditPageUseCase = _getSubscriptionEditPageUseCase;
        this._updateSubscriptionUseCase = _updateSubscriptionUseCase;
    }
    // --------------------------------------------------
    //              🛠 CREATE SUBSCRIPTION
    // --------------------------------------------------
    addSubscriptionPlan(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parseResult = subscriptionValidator_1.createSubscriptionSchema.safeParse(req.body);
                if (parseResult.error) {
                    throw new exceptions_1.InvalidDataException(error_1.Errors.INVALID_DATA);
                }
                const subscription = yield this._createSubscriptionUseCase.createSubscription(parseResult.data);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.SUBSCRIPTION.SUBSCRIPTION_CREATE_SUCCESS, subscription, 201 /* HTTPStatus.CREATED */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAllSubscriptionPlans(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // console.log("reached getAllSubscriptionPlans");
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const status = req.query.status || undefined;
                const search = req.query.search || undefined;
                if (page < 1 || limit < 1 || limit > 100) {
                    throw new exceptions_1.InvalidDataException(error_1.Errors.INVALID_PAGINATION_PARAMETERS);
                }
                const result = yield this._getAllSubscriptionUseCase.getAllSubscription(page, limit, status, search);
                if (!result || ((_a = result.subscriptions) === null || _a === void 0 ? void 0 : _a.length) === 0) {
                    throw new exceptions_1.NotFoundException(error_1.SUBSCRIPTION_ERRORS.NO_SUBSCRIPTIONS_FOUND);
                }
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.SUBSCRIPTION.SUBSCRIPTION_GET_SUCCESS, { data: result }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateSubscriptionStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, status } = req.body;
                if (!id || !status) {
                    throw new exceptions_1.InvalidDataException(error_1.Errors.INVALID_DATA);
                }
                const subscription = yield this._updateSubscriptionStatusUseCase.updateSubscriptionStatus(id, status);
                //   console.log('subscription', subscription);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.SUBSCRIPTION.SUBSCRIPTION_UPDATE_STATUS_SUCCESS, subscription, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getSubscriptionEditPage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { subscriptionId } = req.params;
                if (!subscriptionId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                const subscription = yield this._getSubscriptionEditPageUseCase.getSubscriptionEditPage(subscriptionId);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.SUBSCRIPTION.SUBSCRIPTION_EDIT_PAGE_SUCCESS, subscription, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateSubscription(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { subscriptionId } = req.params;
                if (!subscriptionId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                const parseResult = subscriptionValidator_1.updateSubscriptionSchema.safeParse(req.body);
                if (parseResult.error) {
                    throw new exceptions_1.InvalidDataException(error_1.Errors.INVALID_DATA);
                }
                const subscription = yield this._updateSubscriptionUseCase.updateSubscription(subscriptionId, parseResult.data);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.SUBSCRIPTION.SUBSCRIPTION_UPDATE_SUCCESS, subscription, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AdminSubscriptionController = AdminSubscriptionController;
