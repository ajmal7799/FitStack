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
exports.VerificationApproveUseCase = void 0;
const exceptions_1 = require("../../../constants/exceptions");
const error_1 = require("../../../../shared/constants/error");
const NotificationEnums_1 = require("../../../../domain/enum/NotificationEnums");
const userEnums_1 = require("../../../../domain/enum/userEnums");
class VerificationApproveUseCase {
    constructor(_verificationRepository, _createNotification) {
        this._verificationRepository = _verificationRepository;
        this._createNotification = _createNotification;
    }
    execute(trainerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const verification = yield this._verificationRepository.findByTrainerId(trainerId);
            if (!verification) {
                throw new exceptions_1.NotFoundException(error_1.TRAINER_ERRORS.TRAINER_VERIFICATION_NOT_FOUND);
            }
            const trainerVerification = yield this._verificationRepository.verifyTrainer(trainerId);
            if (!trainerVerification) {
                throw new exceptions_1.NotFoundException(error_1.TRAINER_ERRORS.TRAINER_VERIFICATION_NOT_FOUND);
            }
            yield this._createNotification.execute({
                recipientId: trainerId,
                recipientRole: userEnums_1.UserRole.TRAINER,
                type: NotificationEnums_1.NotificationType.VERIFICATION_APPROVED,
                title: "Verification Approved",
                message: "Your documents have been verified. You can now start hosting sessions!",
                isRead: false
            });
            return {
                id: trainerVerification.id,
                verificationStatus: trainerVerification.verificationStatus,
            };
        });
    }
}
exports.VerificationApproveUseCase = VerificationApproveUseCase;
