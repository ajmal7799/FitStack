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
exports.GetSelectedTrainerUseCase = void 0;
const exceptions_1 = require("../../../constants/exceptions");
const error_1 = require("../../../../shared/constants/error");
const trainerMappers_1 = require("../../../mappers/trainerMappers");
class GetSelectedTrainerUseCase {
    constructor(_trainerSelectRepository, _userRepository, _storageService, _trainerRepository) {
        this._trainerSelectRepository = _trainerSelectRepository;
        this._userRepository = _userRepository;
        this._storageService = _storageService;
        this._trainerRepository = _trainerRepository;
    }
    getSelectedTrainer(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._trainerSelectRepository.findByUserId(userId);
            if (!user) {
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.USER_NOT_SELECTED);
            }
            const trainer = yield this._userRepository.findById(user.trainerId);
            if (!trainer) {
                throw new exceptions_1.NotFoundException(error_1.TRAINER_ERRORS.TRAINER_NOT_FOUND);
            }
            const trainerData = yield this._trainerRepository.findByTrainerId(user.trainerId);
            if (!trainerData) {
                throw new exceptions_1.NotFoundException(error_1.TRAINER_ERRORS.TRAINER_NOT_FOUND);
            }
            let profileImageUrl = trainer.profileImage;
            if (trainer.profileImage) {
                profileImageUrl = yield this._storageService.createSignedUrl(trainer.profileImage, 300);
            }
            return trainerMappers_1.TrainerMapper.toDTO(trainerData, trainer, profileImageUrl);
        });
    }
}
exports.GetSelectedTrainerUseCase = GetSelectedTrainerUseCase;
