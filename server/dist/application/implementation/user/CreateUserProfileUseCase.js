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
exports.CreateUserProfileUseCase = void 0;
const exceptions_1 = require("../../constants/exceptions");
const error_1 = require("../../../shared/constants/error");
class CreateUserProfileUseCase {
    constructor(_userRepository, _storageService, _userProfileRepository) {
        this._userRepository = _userRepository;
        this._storageService = _storageService;
        this._userProfileRepository = _userProfileRepository;
    }
    createUserProfile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, age, gender, height, weight, fitnessGoal, targetWeight, experienceLevel, workoutLocation, dietPreference, preferredWorkoutTypes, medicalConditions, } = data;
            const user = yield this._userRepository.findById(userId);
            if (!user) {
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.USER_NOT_FOUND);
            }
            let profileImageUrl;
            // if (profileImage) {
            //     profileImageUrl = await this._storageService.upload(
            //         profileImage,
            //         StorageFolderNameEnums.USER_PROFILE_IMAGE + '/' + userId + Date.now(),
            //     );
            //     await this._userRepository.updateUserProfileImage(userId, profileImageUrl);
            // }
            const updateUserProfile = yield this._userProfileRepository.createUserProfile(userId, {
                age,
                gender,
                height,
                weight,
                fitnessGoal,
                targetWeight,
                experienceLevel,
                workoutLocation,
                dietPreference,
                preferredWorkoutTypes,
                medicalConditions,
                profileCompleted: true,
            });
            return {
                userProfile: updateUserProfile,
            };
        });
    }
}
exports.CreateUserProfileUseCase = CreateUserProfileUseCase;
