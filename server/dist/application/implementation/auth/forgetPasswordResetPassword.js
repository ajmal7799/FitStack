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
exports.ForgetPasswordResetPasswordUseCase = void 0;
const error_1 = require("../../../shared/constants/error");
const exceptions_1 = require("../../constants/exceptions");
class ForgetPasswordResetPasswordUseCase {
    constructor(_cacheStorage, _userRepository, _hashService) {
        this._cacheStorage = _cacheStorage;
        this._userRepository = _userRepository;
        this._hashService = _hashService;
    }
    resetPassword(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedToken = yield this._cacheStorage.getData(`RTP/${dto.email}`);
            if (!cachedToken) {
                throw new exceptions_1.TokenExpiredException(error_1.Errors.TOKEN_EXPIRED);
            }
            if (cachedToken !== dto.token) {
                throw new exceptions_1.InvalidDataException(error_1.Errors.INVALID_DATA);
            }
            const hashedPassword = yield this._hashService.hashPassword(dto.password);
            yield this._userRepository.findByIdAndUpdatePassword(dto.email, hashedPassword);
            yield this._cacheStorage.deleteData(`RTP/${dto.email}`);
        });
    }
}
exports.ForgetPasswordResetPasswordUseCase = ForgetPasswordResetPasswordUseCase;
