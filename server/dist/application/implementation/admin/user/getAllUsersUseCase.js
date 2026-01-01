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
exports.GetAllUsersUseCase = void 0;
const userMappers_1 = require("../../../mappers/userMappers");
class GetAllUsersUseCase {
    constructor(_userRepository) {
        this._userRepository = _userRepository;
    }
    getAllUser(page, limit, status, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const [users, totalUsers] = yield Promise.all([
                this._userRepository.findAllUsers(skip, limit, status, search),
                this._userRepository.countUsers(status, search),
            ]);
            const userDTOs = users.map((user) => userMappers_1.UserMapper.toDTO(user));
            return {
                users: userDTOs,
                totalUsers,
                totalPages: Math.ceil(totalUsers / limit),
                currentPage: page,
            };
        });
    }
}
exports.GetAllUsersUseCase = GetAllUsersUseCase;
