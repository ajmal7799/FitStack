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
exports.NotificationController = void 0;
const messages_1 = require("../../../shared/constants/messages");
const responseHelper_1 = require("../../../shared/utils/responseHelper");
class NotificationController {
    constructor(_getNotificationsUseCase, _markAsReadUseCase) {
        this._getNotificationsUseCase = _getNotificationsUseCase;
        this._markAsReadUseCase = _markAsReadUseCase;
    }
    getNotifications(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            const result = yield this._getNotificationsUseCase.execute(userId);
            responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.NOTIFICATION.GET_NOTIFICATIONS_SUCCESS, result, 200 /* HTTPStatus.OK */);
        });
    }
    markAsRead(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { notificationId } = req.params;
            const result = yield this._markAsReadUseCase.markOne(notificationId);
            responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.NOTIFICATION.MARK_AS_READ_SUCCESS, result, 200 /* HTTPStatus.OK */);
        });
    }
    markAllAsRead(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            const result = yield this._markAsReadUseCase.markAll(userId);
            responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.NOTIFICATION.MARK_ALL_AS_READ_SUCCESS, result, 200 /* HTTPStatus.OK */);
        });
    }
    clearAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            yield this._markAsReadUseCase.clearAll(userId);
            responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.NOTIFICATION.CLEAR_ALL_SUCCESS, null, 200 /* HTTPStatus.OK */);
        });
    }
}
exports.NotificationController = NotificationController;
