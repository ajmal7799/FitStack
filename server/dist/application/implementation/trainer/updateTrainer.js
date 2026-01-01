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
exports.UpdateTrainer = void 0;
const exceptions_1 = require("../../constants/exceptions");
const error_1 = require("../../../shared/constants/error");
const storageFolderNameEnums_1 = require("../../../domain/enum/storageFolderNameEnums");
const verificationStatus_1 = require("../../../domain/enum/verificationStatus");
class UpdateTrainer {
    constructor(_userRepository, _storageService, _trainerRepository, _verificationRepository) {
        this._userRepository = _userRepository;
        this._storageService = _storageService;
        this._trainerRepository = _trainerRepository;
        this._verificationRepository = _verificationRepository;
    }
    updateTrainerProfile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { trainerId, qualification, specialisation, experience, about, idCard, educationCert, experienceCert } = data;
            const trainer = yield this._userRepository.findById(trainerId);
            if (!trainer) {
                throw new exceptions_1.NotFoundException(error_1.TRAINER_ERRORS.TRAINER_NOT_FOUND);
            }
            const idCardUrl = yield this._storageService.upload(idCard, storageFolderNameEnums_1.StorageFolderNameEnums.IDENTITY_VERIFICATION + '/' + trainerId + Date.now());
            const educationCertUrl = yield this._storageService.upload(educationCert, storageFolderNameEnums_1.StorageFolderNameEnums.EDUCATION_CERTIFICATES + '/' + trainerId + Date.now());
            const experienceCertUrl = yield this._storageService.upload(experienceCert, storageFolderNameEnums_1.StorageFolderNameEnums.EXPERIENCE_CERTIFICATES + '/' + trainerId + Date.now());
            const updatedTrainer = yield this._trainerRepository.profileCompletion(trainerId, {
                qualification,
                specialisation,
                experience,
                about,
                isVerified: true,
            });
            const updatedVerification = yield this._verificationRepository.updateTrainerVerification(trainerId, {
                idCard: idCardUrl,
                educationCert: educationCertUrl,
                experienceCert: experienceCertUrl,
                verificationStatus: verificationStatus_1.VerificationStatus.PENDING,
                submittedAt: new Date(),
            });
            return {
                trainer: updatedTrainer,
                verification: updatedVerification,
            };
        });
    }
}
exports.UpdateTrainer = UpdateTrainer;
