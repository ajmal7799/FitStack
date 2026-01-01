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
exports.UpdateUserStatusUseCase = void 0;
const userEnums_1 = require("../../../../domain/enum/userEnums");
const error_1 = require("../../../../shared/constants/error");
const exceptions_1 = require("../../../constants/exceptions");
class UpdateUserStatusUseCase {
    constructor(_userRepository) {
        this._userRepository = _userRepository;
    }
    updateUserStatus(userId, currentStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const newStatus = currentStatus === userEnums_1.UserStatus.ACTIVE ? userEnums_1.UserStatus.BLOCKED : userEnums_1.UserStatus.ACTIVE;
            const updatedUser = yield this._userRepository.updateStatus(userId, newStatus);
            if (!updatedUser)
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.USER_NOT_FOUND);
            return { user: updatedUser };
        });
    }
}
exports.UpdateUserStatusUseCase = UpdateUserStatusUseCase;
