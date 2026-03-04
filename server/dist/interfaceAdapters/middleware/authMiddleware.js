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
exports.AuthMiddleware = void 0;
const error_1 = require("../../shared/constants/error");
const userEnums_1 = require("../../domain/enum/userEnums");
const exceptions_1 = require("../../application/constants/exceptions");
class AuthMiddleware {
    constructor(_jwtService, _cacheService, _userRepository) {
        this._jwtService = _jwtService;
        this._cacheService = _cacheService;
        this._userRepository = _userRepository;
        // --------------------------------------------------
        //              🛠 VERIFY TOKEN
        // --------------------------------------------------
        this.verify = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const header = req.header('Authorization');
                if (!(header === null || header === void 0 ? void 0 : header.startsWith('Bearer '))) {
                    res.status(401 /* HTTPStatus.UNAUTHORIZED */).json({
                        success: false,
                        message: error_1.Errors.INVALID_TOKEN
                    });
                    return;
                }
                const token = header.split(' ')[1];
                let decoded;
                try {
                    decoded = this._jwtService.verifyAccessToken(token);
                }
                catch (error) {
                    // ✅ Return 401 with specific code so frontend knows to refresh
                    res.status(401 /* HTTPStatus.UNAUTHORIZED */).json({
                        success: false,
                        message: 'TOKEN_EXPIRED', // ← frontend checks this
                    });
                    return;
                }
                if (!decoded) {
                    res.status(401 /* HTTPStatus.UNAUTHORIZED */).json({
                        success: false,
                        message: error_1.Errors.INVALID_TOKEN
                    });
                    return;
                }
                const user = yield this._userRepository.findById(decoded.userId);
                if (!user) {
                    throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.USER_NOT_FOUND);
                }
                if (user.isActive === userEnums_1.UserStatus.BLOCKED) {
                    throw new exceptions_1.IsBlockedExecption(error_1.USER_ERRORS.USER_BLOCKED);
                }
                req.user = {
                    userId: user._id,
                    role: user.role,
                };
                next();
            }
            catch (error) {
                next(error);
            }
        });
        // --------------------------------------------------
        //              🛠 ROLE CHECKING (reusable)
        // --------------------------------------------------
        this.hasRole = (...roles) => {
            return (req, res, next) => {
                if (!req.user) {
                    return res.status(401 /* HTTPStatus.UNAUTHORIZED */).json({
                        success: false,
                        message: error_1.Errors.INVALID_TOKEN,
                    });
                }
                if (!roles.includes(req.user.role)) {
                    return res.status(403 /* HTTPStatus.FORBIDDEN */).json({
                        success: false,
                        message: error_1.Errors.FORBIDDEN,
                    });
                }
                next();
            };
        };
        // --------------------------------------------------
        //              🛠 CONVENIENCE ROLE MIDDLEWARES
        // --------------------------------------------------
        this.isAdmin = this.hasRole(userEnums_1.UserRole.ADMIN);
        this.isTrainer = this.hasRole(userEnums_1.UserRole.TRAINER);
        this.isUser = this.hasRole(userEnums_1.UserRole.USER);
    }
}
exports.AuthMiddleware = AuthMiddleware;
