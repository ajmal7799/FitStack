"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenCreationUseCase = void 0;
class TokenCreationUseCase {
    constructor(_JWTService) {
        this._JWTService = _JWTService;
    }
    createAccessTokenAndRefreshToken(payload) {
        const accessToken = this._JWTService.createAccessToken(payload);
        const refreshToken = this._JWTService.createRefreshToken(payload);
        return { accessToken, refreshToken };
    }
}
exports.TokenCreationUseCase = TokenCreationUseCase;
