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
exports.GetPersonalInfoUseCase = void 0;
const exceptions_1 = require("../../../constants/exceptions");
const error_1 = require("../../../../shared/constants/error");
const userProfileMapper_1 = require("../../../mappers/userProfileMapper");
class GetPersonalInfoUseCase {
    constructor(_userRepository, _userProfileRepository, _storageService) {
        this._userRepository = _userRepository;
        this._userProfileRepository = _userProfileRepository;
        this._storageService = _storageService;
    }
    execute(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findById(userId);
            if (!user) {
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.USER_NOT_FOUND);
            }
            const userProfile = yield this._userProfileRepository.findByUserId(userId);
            if (!userProfile) {
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.USER_PROFILE_NOT_FOUND);
            }
            const response = userProfileMapper_1.UserProfileMapper.mapToGetUserProfileDTO(userProfile);
            return response;
        });
    }
}
exports.GetPersonalInfoUseCase = GetPersonalInfoUseCase;
