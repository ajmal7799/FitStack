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
exports.UserGoogleLoginUseCase = void 0;
const userEnums_1 = require("../../../domain/enum/userEnums");
const userMappers_1 = require("../../mappers/userMappers");
class UserGoogleLoginUseCase {
    constructor(_googleAuthService, _userRepository, _userProfileRepository) {
        this._googleAuthService = _googleAuthService;
        this._userRepository = _userRepository;
        this._userProfileRepository = _userProfileRepository;
    }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ authorizationCode, role }) {
            const { email, googleId, name } = yield this._googleAuthService.authorize(authorizationCode);
            let user = yield this._userRepository.findByEmail(email);
            if (!user) {
                user = {
                    email,
                    name,
                    role: userEnums_1.UserRole.USER,
                    isActive: userEnums_1.UserStatus.ACTIVE,
                    googleId,
                };
                const id = yield this._userRepository.googleSignUp(user);
                user._id = id;
            }
            let userProfile = true;
            if (user.role === userEnums_1.UserRole.USER) {
                const profile = yield this._userProfileRepository.findByUserId(user._id);
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
            return userMappers_1.UserMapper.toLoginUserResponse(user, true, userProfile);
        });
    }
}
exports.UserGoogleLoginUseCase = UserGoogleLoginUseCase;
