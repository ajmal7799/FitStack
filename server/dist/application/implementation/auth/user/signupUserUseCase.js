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
exports.RegisterUserUseCase = void 0;
const userMappers_1 = require("../../../mappers/userMappers");
const error_1 = require("../../../../shared/constants/error");
const exceptions_1 = require("../../../constants/exceptions");
class RegisterUserUseCase {
    constructor(_userRepository, _hashService) {
        this._userRepository = _userRepository;
        this._hashService = _hashService;
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = data;
            const existingUser = yield this._userRepository.findByEmail(email);
            if (existingUser) {
                throw new exceptions_1.AlreadyExisitingExecption(error_1.USER_ERRORS.USER_ALREADY_EXISTS);
            }
            const hashedPassword = yield this._hashService.hashPassword(password);
            const userEntity = userMappers_1.UserMapper.toEntity(Object.assign(Object.assign({}, data), { password: hashedPassword }));
            const savedUser = yield this._userRepository.save(userEntity);
            return savedUser;
        });
    }
}
exports.RegisterUserUseCase = RegisterUserUseCase;
