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
exports.GetTrainerDetailsUseCase = void 0;
const exceptions_1 = require("../../../constants/exceptions");
const error_1 = require("../../../../shared/constants/error");
const trainerMappers_1 = require("../../../mappers/trainerMappers");
class GetTrainerDetailsUseCase {
    constructor(_trainerRepository, _userRepository, _storageService) {
        this._trainerRepository = _trainerRepository;
        this._userRepository = _userRepository;
        this._storageService = _storageService;
    }
    getTrainerDetails(trainerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [user, trainer] = yield Promise.all([
                this._userRepository.findById(trainerId),
                this._trainerRepository.findByTrainerId(trainerId),
            ]);
            if (!user) {
                throw new exceptions_1.NotFoundException(error_1.TRAINER_ERRORS.TRAINER_NOT_FOUND);
            }
            if (!trainer) {
                throw new exceptions_1.NotFoundException(error_1.TRAINER_ERRORS.TRAINER_PROFILE_DATA_NOT_FOUND);
            }
            let profileImageUrl = user.profileImage;
            if (user.profileImage) {
                profileImageUrl = yield this._storageService.createSignedUrl(user.profileImage, 300);
            }
            return trainerMappers_1.TrainerMapper.toDTO(trainer, user, profileImageUrl);
        });
    }
}
exports.GetTrainerDetailsUseCase = GetTrainerDetailsUseCase;
