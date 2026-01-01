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
exports.GetAllVerificationUseCase = void 0;
const verificationMappers_1 = require("../../../mappers/verificationMappers");
class GetAllVerificationUseCase {
    constructor(_verificationRepository) {
        this._verificationRepository = _verificationRepository;
    }
    getAllVerification(page, limit, status, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const [verifications, totalVerifications] = yield Promise.all([
                this._verificationRepository.findAllVerification(skip, limit, status, search),
                this._verificationRepository.countVerifications(status, search),
            ]);
            const verificationDTOs = verifications.map(verification => verificationMappers_1.VerificationMapper.toDTO(verification.verification, verification.trainer, verification.user));
            return {
                verifications: verificationDTOs,
                totalVerifications,
                totalPages: Math.ceil(totalVerifications / limit),
                currentPage: page,
            };
        });
    }
}
exports.GetAllVerificationUseCase = GetAllVerificationUseCase;
