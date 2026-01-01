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
exports.UpdateUserProfileUseCase = void 0;
const exceptions_1 = require("../../../constants/exceptions");
const error_1 = require("../../../../shared/constants/error");
const storageFolderNameEnums_1 = require("../../../../domain/enum/storageFolderNameEnums");
class UpdateUserProfileUseCase {
    constructor(_userRepository, _storageService) {
        this._userRepository = _userRepository;
        this._storageService = _storageService;
    }
    execute(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findById(userId);
            if (!user) {
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.USER_NOT_FOUND);
            }
            if (data.email && data.email !== user.email) {
                const existingUser = yield this._userRepository.findByEmail(data.email);
                if (existingUser)
                    throw new exceptions_1.AlreadyExisitingExecption(error_1.USER_ERRORS.USER_ALREADY_EXISTS);
            }
            let profileImageUrl;
            if (data.profileImage) {
                profileImageUrl = yield this._storageService.upload(data.profileImage, storageFolderNameEnums_1.StorageFolderNameEnums.USER_PROFILE_IMAGE + '/' + userId + Date.now());
                yield this._userRepository.updateUserProfileImage(userId, profileImageUrl);
            }
            const userProfileData = {
                name: data.name || user.name,
                email: data.email || user.email,
                phone: data.phone || user.phone,
                role: user.role,
                isActive: user.isActive,
                profileImage: profileImageUrl || user.profileImage,
            };
            return yield this._userRepository.updateTrainerProfile(userId, userProfileData);
        });
    }
}
exports.UpdateUserProfileUseCase = UpdateUserProfileUseCase;
