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
exports.FeedbackController = void 0;
const messages_1 = require("../../../shared/constants/messages");
const responseHelper_1 = require("../../../shared/utils/responseHelper");
const exceptions_1 = require("../../../application/constants/exceptions");
class FeedbackController {
    constructor(_createFeedbackUseCase) {
        this._createFeedbackUseCase = _createFeedbackUseCase;
    }
    createfeedback(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log('reached here');
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const { sessionId, rating, review } = req.body;
                if (!sessionId || !rating) {
                    throw new exceptions_1.DataMissingExecption('SessionId and rating required');
                }
                const result = yield this._createFeedbackUseCase.createFeedback(userId, sessionId, rating, review);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.USERS.FEEDBACK_CREATED_SUCCESS, { result }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.FeedbackController = FeedbackController;
