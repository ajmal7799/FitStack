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
exports.AdminAuthController = void 0;
const userEnums_1 = require("../../../domain/enum/userEnums");
const setRefreshTokenCookie_1 = require("../../../shared/utils/setRefreshTokenCookie");
const loginValidator_1 = require("../../../shared/validations/loginValidator");
const messages_1 = require("../../../shared/constants/messages");
const responseHelper_1 = require("../../../shared/utils/responseHelper");
class AdminAuthController {
    constructor(_adminLoginUseCase, _tokenCreationUseCase) {
        this._adminLoginUseCase = _adminLoginUseCase;
        this._tokenCreationUseCase = _tokenCreationUseCase;
    }
    // --------------------------------------------------
    //               ADMIN LOGIN
    // --------------------------------------------------
    adminLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = loginValidator_1.loginSchema.parse(req.body);
                console.log('email', email, password);
                const user = yield this._adminLoginUseCase.adminLogin(email, password);
                const token = this._tokenCreationUseCase.createAccessTokenAndRefreshToken({
                    userId: user._id.toString(),
                    role: userEnums_1.UserRole.ADMIN,
                });
                (0, setRefreshTokenCookie_1.setRefreshTokenCookie)(res, token.refreshToken);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.USERS.LOGIN_SUCCESS, { user, accessToken: token.accessToken }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                // console.error("Admin login error:", error);
                next(error);
            }
        });
    }
}
exports.AdminAuthController = AdminAuthController;
