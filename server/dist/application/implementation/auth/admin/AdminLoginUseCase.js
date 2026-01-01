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
exports.AdminLoginUseCase = void 0;
const userEnums_1 = require("../../../../domain/enum/userEnums");
const error_1 = require("../../../../shared/constants/error");
const userMappers_1 = require("../../../mappers/userMappers");
const exceptions_1 = require("../../../constants/exceptions");
class AdminLoginUseCase {
    constructor(_userRepository, _hashService) {
        this._userRepository = _userRepository;
        this._hashService = _hashService;
    }
    adminLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findByEmail(email);
            if (!user) {
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.USER_NOT_FOUND);
            }
            if (user.role !== userEnums_1.UserRole.ADMIN) {
                throw new exceptions_1.InvalidDataException(error_1.ADMIN_ERRORS.ADMIN_SIGNUP_NOT_ALLOWED);
            }
            const verifyPassword = yield this._hashService.comparePassword(password, user.password);
            if (!verifyPassword) {
                throw new exceptions_1.InvalidDataException(error_1.Errors.INVALID_CREDENTIALS);
            }
            const response = userMappers_1.UserMapper.toLoginAdminResponse(user);
            return response;
        });
    }
}
exports.AdminLoginUseCase = AdminLoginUseCase;
