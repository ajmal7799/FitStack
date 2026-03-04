"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTService = void 0;
const config_1 = require("../config/config");
const jsonwebtoken_1 = require("jsonwebtoken");
const exceptions_1 = require("../../application/constants/exceptions");
const error_1 = require("../../shared/constants/error");
class JWTService {
    createAccessToken(payload) {
        const secretKey = config_1.CONFIG.JWT_SECRET;
        if (!secretKey)
            throw new Error('Access Token Secret Key Not Found');
        try {
            return (0, jsonwebtoken_1.sign)(payload, secretKey, { expiresIn: '7d' }); // ← short lived
        }
        catch (error) {
            throw new exceptions_1.InvalidDataException(error_1.Errors.ACCESS_TOKEN_CREATION_FAILED);
        }
    }
    createRefreshToken(payload) {
        const secretKey = config_1.CONFIG.JWT_REFRESH_SECRET; // ← separate secret
        if (!secretKey)
            throw new Error('Refresh Token Secret Key Not Found');
        try {
            return (0, jsonwebtoken_1.sign)(payload, secretKey, { expiresIn: '7d' }); // ← long lived
        }
        catch (error) {
            throw new exceptions_1.InvalidDataException(error_1.Errors.REFRESH_TOKEN_CREATION_FAILED);
        }
    }
    verifyAccessToken(token) {
        const secretKey = config_1.CONFIG.JWT_SECRET;
        if (!secretKey)
            throw new exceptions_1.TokenMissingException(error_1.Errors.ACCESS_TOKEN_SECRETKEY_MISSING);
        if (!token)
            throw new exceptions_1.TokenMissingException(error_1.Errors.ACCESS_TOKEN_MISSING);
        try {
            return (0, jsonwebtoken_1.verify)(token, secretKey);
        }
        catch (error) {
            throw new exceptions_1.TokenExpiredException(error_1.Errors.TOKEN_EXPIRED);
        }
    }
    verifyRefreshToken(token) {
        const secretKey = config_1.CONFIG.JWT_REFRESH_SECRET; // ← separate secret
        if (!secretKey)
            throw new Error('Refresh Token Secret Key Not Found');
        if (!token)
            throw new exceptions_1.TokenMissingException(error_1.Errors.ACCESS_TOKEN_MISSING);
        try {
            return (0, jsonwebtoken_1.verify)(token, secretKey);
        }
        catch (error) {
            throw new exceptions_1.TokenExpiredException(error_1.Errors.TOKEN_EXPIRED);
        }
    }
}
exports.JWTService = JWTService;
