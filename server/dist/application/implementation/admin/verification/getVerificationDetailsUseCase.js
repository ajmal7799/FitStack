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
exports.GetVerificationDetailsUseCase = void 0;
const exceptions_1 = require("../../../constants/exceptions");
const error_1 = require("../../../../shared/constants/error");
const verificationMappers_1 = require("../../../mappers/verificationMappers");
class GetVerificationDetailsUseCase {
    constructor(_verificationRepository, _storageService) {
        this._verificationRepository = _verificationRepository;
        this._storageService = _storageService;
    }
    execute(trainerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const verification = yield this._verificationRepository.findByTrainerId(trainerId);
            if (!verification) {
                throw new exceptions_1.NotFoundException(error_1.TRAINER_ERRORS.TRAINER_VERIFICATION_NOT_FOUND);
            }
            const result = yield this._verificationRepository.findVerificationByTrainerId(trainerId);
            const response = verificationMappers_1.VerificationMapper.toDetailDTO(result.verification, result.trainer, result.user);
            response.idCard = yield this._storageService.createSignedUrl(response.idCard, 10 * 60);
            response.educationCert = yield this._storageService.createSignedUrl(response.educationCert, 10 * 60);
            response.experienceCert = yield this._storageService.createSignedUrl(response.experienceCert, 10 * 60);
            return response;
        });
    }
}
exports.GetVerificationDetailsUseCase = GetVerificationDetailsUseCase;
