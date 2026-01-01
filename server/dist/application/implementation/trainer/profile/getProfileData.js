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
exports.GetProfileData = void 0;
const exceptions_1 = require("../../../constants/exceptions");
const error_1 = require("../../../../shared/constants/error");
const trainerMappers_1 = require("../../../mappers/trainerMappers");
class GetProfileData {
    constructor(_userRepository, _trainerRepository, _verificationRepository, _storageService) {
        this._userRepository = _userRepository;
        this._trainerRepository = _trainerRepository;
        this._verificationRepository = _verificationRepository;
        this._storageService = _storageService;
    }
    getProfileData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const trainer = yield this._userRepository.findById(id);
            if (!trainer) {
                throw new exceptions_1.NotFoundException(error_1.TRAINER_ERRORS.TRAINER_NOT_FOUND);
            }
            const trainerData = yield this._trainerRepository.findByTrainerId(id);
            if (!trainerData) {
                throw new exceptions_1.NotFoundException(error_1.TRAINER_ERRORS.TRAINER_NOT_FOUND);
            }
            const verificationDetails = yield this._verificationRepository.findByTrainerId(id);
            if (!verificationDetails) {
                throw new exceptions_1.NotFoundException(error_1.TRAINER_ERRORS.TRAINER_VERIFICATION_NOT_FOUND);
            }
            const reponse = trainerMappers_1.TrainerMapper.toTrainerProfileDTO(trainerData, trainer, verificationDetails);
            reponse.profileImage = yield this._storageService.createSignedUrl(reponse.profileImage, 10 * 60);
            return reponse;
        });
    }
}
exports.GetProfileData = GetProfileData;
