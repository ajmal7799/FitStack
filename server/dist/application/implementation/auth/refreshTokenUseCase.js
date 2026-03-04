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
exports.RefreshTokenUseCase = void 0;
const error_1 = require("../../../shared/constants/error");
class RefreshTokenUseCase {
    constructor(_jwtService) {
        this._jwtService = _jwtService;
    }
    refresh(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = this._jwtService.verifyRefreshToken(token);
            if (!decoded) {
                throw new Error(error_1.Errors.REFRESH_TOKEN_EXPIRED);
            }
            const accessToken = this._jwtService.createAccessToken({
                userId: decoded.userId,
                role: decoded.role,
            });
            return accessToken;
        });
    }
}
exports.RefreshTokenUseCase = RefreshTokenUseCase;
