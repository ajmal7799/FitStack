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
exports.UserLoginUseCase = void 0;
const error_1 = require("../../../../shared/constants/error");
const userMappers_1 = require("../../../mappers/userMappers");
const userEnums_1 = require("../../../../domain/enum/userEnums");
const exceptions_1 = require("../../../constants/exceptions");
class UserLoginUseCase {
    constructor(userRepository, hashService, trainerRepository, userProfileRepository) {
        this._userRepository = userRepository;
        this._hashService = hashService;
        this._trainerRepository = trainerRepository;
        this._userProfileRepository = userProfileRepository;
    }
    userLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findByEmail(email);
            if (!user) {
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.USER_NOT_FOUND);
            }
            if (user.isActive === userEnums_1.UserStatus.BLOCKED) {
                throw new exceptions_1.IsBlockedExecption(error_1.USER_ERRORS.USER_BLOCKED);
            }
            const verifyPassword = yield this._hashService.comparePassword(password, user.password);
            if (!verifyPassword) {
                throw new exceptions_1.PasswordNotMatchingException(error_1.Errors.INVALID_CREDENTIALS);
            }
            let verificationCheck = true;
            let userProfile = true;
            let hasActiveSubscription = false;
            if (user.role === userEnums_1.UserRole.TRAINER) {
                const trainer = yield this._trainerRepository.findByTrainerId(user._id);
                if (!trainer) {
                    verificationCheck = false;
                }
                else if (trainer.isVerified) {
                    verificationCheck = true;
                }
                else {
                    verificationCheck = false;
                }
            }
            else if (user.role === userEnums_1.UserRole.USER) {
                const profile = yield this._userProfileRepository.findByUserId(user._id);
                hasActiveSubscription = user.activeMembershipId ? true : false;
                if (!profile) {
                    userProfile = false;
                }
                else if (profile.profileCompleted === true) {
                    userProfile = true;
                }
                else {
                    userProfile = false;
                }
            }
            const response = userMappers_1.UserMapper.toLoginUserResponse(user, verificationCheck, userProfile, hasActiveSubscription);
            return response;
        });
    }
}
exports.UserLoginUseCase = UserLoginUseCase;
