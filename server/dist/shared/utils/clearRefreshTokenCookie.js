"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearRefreshTokenCookie = clearRefreshTokenCookie;
function clearRefreshTokenCookie(res) {
    res.clearCookie('RefreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });
}
