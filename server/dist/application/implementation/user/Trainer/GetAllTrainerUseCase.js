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
exports.GetAllTrainerUseCase = void 0;
const verificationMappers_1 = require("../../../mappers/verificationMappers");
class GetAllTrainerUseCase {
    constructor(_verificationRepository, _storageService) {
        this._verificationRepository = _verificationRepository;
        this._storageService = _storageService;
    }
    getAllTrainer(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const [verifications, totalVerifications] = yield Promise.all([
                this._verificationRepository.allVerifiedTrainer(skip, limit, search),
                this._verificationRepository.countVerifiedTrainer(search),
            ]);
            const verificationDTOs = yield Promise.all(verifications.map((verification) => __awaiter(this, void 0, void 0, function* () {
                let profileImageUrl = verification.user.profileImage;
                if (profileImageUrl) {
                    profileImageUrl = yield this._storageService.createSignedUrl(profileImageUrl, 60 * 5);
                }
                return verificationMappers_1.VerificationMapper.toDTO(verification.verification, verification.trainer, verification.user, profileImageUrl);
            })));
            return {
                verifications: verificationDTOs,
                totalVerifications,
                totalPages: Math.ceil(totalVerifications / limit),
                currentPage: page,
            };
        });
    }
}
exports.GetAllTrainerUseCase = GetAllTrainerUseCase;
