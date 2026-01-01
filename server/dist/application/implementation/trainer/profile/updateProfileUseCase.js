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
exports.UpdateTrainerProfileUseCase = void 0;
const exceptions_1 = require("../../../constants/exceptions");
const error_1 = require("../../../../shared/constants/error");
const storageFolderNameEnums_1 = require("../../../../domain/enum/storageFolderNameEnums");
class UpdateTrainerProfileUseCase {
    constructor(_userRepository, _trainerRepository, _storageService) {
        this._userRepository = _userRepository;
        this._trainerRepository = _trainerRepository;
        this._storageService = _storageService;
    }
    updateTrainerProfile(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findById(id);
            if (!user)
                throw new exceptions_1.NotFoundException(error_1.TRAINER_ERRORS.TRAINER_NOT_FOUND);
            const trainer = yield this._trainerRepository.findByTrainerId(id);
            if (!trainer)
                throw new exceptions_1.NotFoundException(error_1.TRAINER_ERRORS.TRAINER_PROFILE_DATA_NOT_FOUND);
            if (data.email && data.email !== user.email) {
                const existingUser = yield this._userRepository.findByEmail(data.email);
                if (existingUser)
                    throw new exceptions_1.AlreadyExisitingExecption(error_1.USER_ERRORS.USER_ALREADY_EXISTS);
            }
            let profileImageUrl;
            if (data.profileImage) {
                profileImageUrl = yield this._storageService.upload(data.profileImage, storageFolderNameEnums_1.StorageFolderNameEnums.TRAINER_PROFILE_IMAGE + '/' + id + Date.now());
                yield this._userRepository.updateUserProfileImage(id, profileImageUrl);
            }
            const userProfileData = {
                name: data.name || user.name,
                email: data.email || user.email,
                phone: data.phone || user.phone,
                role: user.role,
                isActive: user.isActive,
                profileImage: profileImageUrl || user.profileImage,
            };
            const trainerProfileData = {
                id: trainer.id,
                trainerId: trainer.trainerId,
                qualification: data.qualification || trainer.qualification,
                specialisation: data.specialisation || trainer.specialisation,
                experience: data.experience || trainer.experience,
                about: data.about || trainer.about,
                isVerified: trainer.isVerified,
            };
            const updateUser = yield this._userRepository.updateTrainerProfile(id, userProfileData);
            const updateTrainer = yield this._trainerRepository.updateTrainerProfile(trainer.id, trainerProfileData);
            return { user: updateUser, trainer: updateTrainer };
        });
    }
}
exports.UpdateTrainerProfileUseCase = UpdateTrainerProfileUseCase;
