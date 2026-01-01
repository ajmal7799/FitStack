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
exports.VerificationRejectUseCase = void 0;
const exceptions_1 = require("../../../constants/exceptions");
const error_1 = require("../../../../shared/constants/error");
class VerificationRejectUseCase {
    constructor(_verificationRepository) {
        this._verificationRepository = _verificationRepository;
    }
    execute(id, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const verification = yield this._verificationRepository.findByTrainerId(id);
            if (!verification) {
                throw new exceptions_1.NotFoundException(error_1.TRAINER_ERRORS.TRAINER_VERIFICATION_NOT_FOUND);
            }
            const trainerReject = yield this._verificationRepository.rejectTrainer(id, reason);
            if (!trainerReject) {
                throw new exceptions_1.NotFoundException(error_1.TRAINER_ERRORS.TRAINER_VERIFICATION_NOT_FOUND);
            }
            return {
                id: trainerReject.id,
                verificationStatus: trainerReject.verificationStatus,
                rejectionReason: trainerReject.rejectionReason || '',
            };
        });
    }
}
exports.VerificationRejectUseCase = VerificationRejectUseCase;
