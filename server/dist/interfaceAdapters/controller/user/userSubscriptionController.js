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
exports.UserSubscriptionController = void 0;
const messages_1 = require("../../../shared/constants/messages");
const responseHelper_1 = require("../../../shared/utils/responseHelper");
const exceptions_1 = require("../../../application/constants/exceptions");
const error_1 = require("../../../shared/constants/error");
class UserSubscriptionController {
    constructor(_getAllSubscriptionUseCase, _createCheckoutSessionUseCase, _handleWebhookUseCase, _activeSubscriptionUseCase, _nonSubscribedUsersUseCase, _getWalletUseCase) {
        this._getAllSubscriptionUseCase = _getAllSubscriptionUseCase;
        this._createCheckoutSessionUseCase = _createCheckoutSessionUseCase;
        this._handleWebhookUseCase = _handleWebhookUseCase;
        this._activeSubscriptionUseCase = _activeSubscriptionUseCase;
        this._nonSubscribedUsersUseCase = _nonSubscribedUsersUseCase;
        this._getWalletUseCase = _getWalletUseCase;
    }
    // --------------------------------------------------
    //              🛠 SHOW ALL SUBSCRIPTION PLAN
    // --------------------------------------------------
    getAllSubscriptionPlans(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                if (page < 1 || limit < 1 || limit > 100) {
                    throw new exceptions_1.InvalidDataException(error_1.Errors.INVALID_PAGINATION_PARAMETERS);
                }
                const result = yield this._getAllSubscriptionUseCase.getAllSubscription(page, limit);
                if (!result || ((_a = result.subscriptions) === null || _a === void 0 ? void 0 : _a.length) === 0) {
                    throw new exceptions_1.NotFoundException(error_1.SUBSCRIPTION_ERRORS.NO_SUBSCRIPTIONS_FOUND);
                }
                // console.log("result", result);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.SUBSCRIPTION.SUBSCRIPTION_GET_SUCCESS, { data: result }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // --------------------------------------------------
    //              🛠 CHECKOUT SESSION "PAYMENT"
    // --------------------------------------------------
    createCheckoutSession(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const { planId } = req.body;
                if (!planId || !userId) {
                    throw new exceptions_1.InvalidDataException(error_1.Errors.INTERNAL_SERVER_ERROR);
                }
                const result = yield this._createCheckoutSessionUseCase.execute(planId, userId);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.SUBSCRIPTION.SUBSCRIPTION_GET_SUCCESS, { data: result }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // --------------------------------------------------
    //              🛠 HANDLE STRIPE WEBHOOK
    // --------------------------------------------------
    handleStripeWebhook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = req.headers['stripe-signature'];
            console.log('Body is Buffer:', Buffer.isBuffer(req.body)); // must print TRUE
            console.log('Signature:', signature);
            res.status(200).json({ received: true });
            try {
                yield this._handleWebhookUseCase.excute(req.body, signature);
            }
            catch (error) {
                console.error('❌ Webhook error:', error);
            }
        });
    }
    // --------------------------------------------------
    //              🛠 SHOW ACTIVE SUBSCRIPTION
    // --------------------------------------------------
    getActiveSubscription(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.NO_USERS_FOUND);
                }
                const result = yield this._activeSubscriptionUseCase.showActiveSubscription(userId);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.SUBSCRIPTION.SUBSCRIPTION_GET_SUCCESS, { result }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // --------------------------------------------------
    //              🛠 GET WALLET
    // --------------------------------------------------
    getWallet(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const role = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
                if (!userId) {
                    throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.NO_USERS_FOUND);
                }
                const result = yield this._getWalletUseCase.execute(userId, role);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.SUBSCRIPTION.WALLET_FETCHED_SUCCESS, result, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.UserSubscriptionController = UserSubscriptionController;
