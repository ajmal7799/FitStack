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
exports.UpdateUserBodyMetricsUseCase = void 0;
const exceptions_1 = require("../../../constants/exceptions");
const error_1 = require("../../../../shared/constants/error");
class UpdateUserBodyMetricsUseCase {
    constructor(_userProfileRepository) {
        this._userProfileRepository = _userProfileRepository;
    }
    execute(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userProfileRepository.findByUserId(userId);
            if (!user) {
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.USER_PROFILE_NOT_FOUND);
            }
            return yield this._userProfileRepository.updateUserProfile(userId, data);
        });
    }
}
exports.UpdateUserBodyMetricsUseCase = UpdateUserBodyMetricsUseCase;
