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
exports.ChangePasswordUseCase = void 0;
const exceptions_1 = require("../../constants/exceptions");
const error_1 = require("../../../shared/constants/error");
class ChangePasswordUseCase {
    constructor(_userRepository, _hashedPasswordServices) {
        this._userRepository = _userRepository;
        this._hashedPasswordServices = _hashedPasswordServices;
    }
    changePassword(userId, oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findById(userId);
            if (!user) {
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.USER_NOT_FOUND);
            }
            const isOldPasswordValid = yield this._hashedPasswordServices.comparePassword(oldPassword, user.password);
            if (!isOldPasswordValid) {
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.OLD_PASSWORD_INCORRECT);
            }
            const hashedNewPassword = yield this._hashedPasswordServices.hashPassword(newPassword);
            user.password = hashedNewPassword;
            yield this._userRepository.updateUser(user);
        });
    }
}
exports.ChangePasswordUseCase = ChangePasswordUseCase;
