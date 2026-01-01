"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTService = void 0;
const config_1 = require("../config/config");
const jsonwebtoken_1 = require("jsonwebtoken");
const exceptions_1 = require("../../application/constants/exceptions");
const error_1 = require("../../shared/constants/error");
class JWTService {
    createAccessToken(payload) {
        const SecreteKey = config_1.CONFIG.JWT_SECRET;
        if (!SecreteKey) {
            throw new Error('Access Token Secrete Key Not Found');
        }
        try {
            return (0, jsonwebtoken_1.sign)(payload, SecreteKey, { expiresIn: '7d' });
        }
        catch (error) {
            throw new exceptions_1.InvalidDataException(error_1.Errors.ACCESS_TOKEN_CREATION_FAILED);
        }
    }
    createRefreshToken(payload) {
        const SecreteKey = config_1.CONFIG.JWT_SECRET;
        if (!SecreteKey) {
            throw new Error('Access Token Secrete Key Not Found');
        }
        try {
            return (0, jsonwebtoken_1.sign)(payload, SecreteKey, { expiresIn: '7d' });
        }
        catch (error) {
            throw new exceptions_1.InvalidDataException(error_1.Errors.REFRESH_TOKEN_CREATION_FAILED);
        }
    }
    verifyAccessToken(token) {
        const SecreteKey = config_1.CONFIG.JWT_SECRET;
        if (!SecreteKey) {
            throw new exceptions_1.TokenMissingException(error_1.Errors.ACCESS_TOKEN_SECRETKEY_MISSING);
        }
        if (!token) {
            throw new exceptions_1.TokenMissingException(error_1.Errors.ACCESS_TOKEN_MISSING);
        }
        try {
            const decoded = (0, jsonwebtoken_1.verify)(token, SecreteKey);
            return decoded;
        }
        catch (error) {
            throw new exceptions_1.TokenExpiredException(error_1.Errors.TOKEN_EXPIRED);
        }
    }
    verifyRefreshToken(token) {
        const SecreteKey = config_1.CONFIG.JWT_SECRET;
        if (!SecreteKey) {
            throw new Error('Access Token Secrete Key Not Found');
        }
        try {
            const decode = (0, jsonwebtoken_1.verify)(token, SecreteKey);
            return decode;
        }
        catch (error) {
            throw new exceptions_1.TokenExpiredException(error_1.Errors.TOKEN_EXPIRED);
        }
    }
}
exports.JWTService = JWTService;
