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
exports.UserAuthController = void 0;
const userRegisterValidator_1 = require("../../../shared/validations/userRegisterValidator");
const error_1 = require("../../../shared/constants/error");
const emailValidator_1 = require("../../../shared/validations/emailValidator");
const messages_1 = require("../../../shared/constants/messages");
const userEnums_1 = require("../../../domain/enum/userEnums");
const setRefreshTokenCookie_1 = require("../../../shared/utils/setRefreshTokenCookie");
const loginValidator_1 = require("../../../shared/validations/loginValidator");
const responseHelper_1 = require("../../../shared/utils/responseHelper");
const clearRefreshTokenCookie_1 = require("../../../shared/utils/clearRefreshTokenCookie");
const exceptions_1 = require("../../../application/constants/exceptions");
const forgetPasswordVerifyOtpValidator_1 = require("../../../shared/validations/forgetPasswordVerifyOtpValidator");
const forgetPasswordResetPasswordValidator_1 = require("../../../shared/validations/forgetPasswordResetPasswordValidator");
const googleLoginValidator_1 = require("../../../shared/validations/googleLoginValidator");
class UserAuthController {
    constructor(_registerUseCase, _sendOtpUseCase, _verifyOtpUseCase, _tokenCreationUseCase, _userLoginUseCase, _tokenInvalidationUseCase, _resendOtpUseCase, _forgetPasswordUseCase, _forgetPasswordVerifyOtpUseCase, _forgetPasswordResetPasswordUseCase, _googleLoginUseCase, _jwtService) {
        this._registerUseCase = _registerUseCase;
        this._sendOtpUseCase = _sendOtpUseCase;
        this._verifyOtpUseCase = _verifyOtpUseCase;
        this._tokenCreationUseCase = _tokenCreationUseCase;
        this._userLoginUseCase = _userLoginUseCase;
        this._tokenInvalidationUseCase = _tokenInvalidationUseCase;
        this._resendOtpUseCase = _resendOtpUseCase;
        this._forgetPasswordUseCase = _forgetPasswordUseCase;
        this._forgetPasswordVerifyOtpUseCase = _forgetPasswordVerifyOtpUseCase;
        this._forgetPasswordResetPasswordUseCase = _forgetPasswordResetPasswordUseCase;
        this._googleLoginUseCase = _googleLoginUseCase;
        this._jwtService = _jwtService;
    }
    // --------------------------------------------------
    //               SINGUP SEND OTP
    // --------------------------------------------------
    signUpSendOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validateEmail = emailValidator_1.emailSchema.safeParse(req.body.email);
                if (!validateEmail) {
                    throw new Error(error_1.Errors.INVALID_EMAIL);
                }
                yield this._sendOtpUseCase.signUpSendOtp(validateEmail.data);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.OTP.OTP_SUCCESSFULL, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // --------------------------------------------------
    //               REGISTER USER
    // --------------------------------------------------
    registerUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = userRegisterValidator_1.registerUserSchema.safeParse(req.body);
                if (!userData.success) {
                    res.status(400 /* HTTPStatus.BAD_REQUEST */).json({ message: error_1.Errors.INVALID_USERDATA });
                    return;
                }
                const { email, name, password, phone, otp, role } = userData.data;
                console.log('OTP:', otp);
                const verifiedOtp = yield this._verifyOtpUseCase.verifyOtp(email, otp);
                if (!verifiedOtp) {
                    res.status(400 /* HTTPStatus.BAD_REQUEST */).json({ message: error_1.Errors.OTP_VERIFICATION_FAILED });
                    return;
                }
                const user = yield this._registerUseCase.createUser({ name, email, password, phone, role });
                const token = this._tokenCreationUseCase.createAccessTokenAndRefreshToken({
                    userId: user._id.toString(),
                    role: userEnums_1.UserRole.USER,
                });
                (0, setRefreshTokenCookie_1.setRefreshTokenCookie)(res, token.refreshToken);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.USERS.REGISTER_SUCCESS, { user, accessToken: token.accessToken }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // --------------------------------------------------
    //               RESEND OTP
    // --------------------------------------------------
    resendOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedEmail = emailValidator_1.emailSchema.safeParse(req.body.email);
                if (validatedEmail.error) {
                    throw new exceptions_1.InvalidDataException(error_1.Errors.INVALID_EMAIL);
                }
                yield this._resendOtpUseCase.resendOtp(validatedEmail.data);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.OTP.RESEND_OTP_SUCCESSFULL, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // --------------------------------------------------
    //               LOGIN USER
    // --------------------------------------------------
    loginUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = loginValidator_1.loginSchema.parse(req.body);
                const user = yield this._userLoginUseCase.userLogin(email, password);
                const token = this._tokenCreationUseCase.createAccessTokenAndRefreshToken({
                    userId: user._id.toString(),
                    role: userEnums_1.UserRole.USER,
                });
                (0, setRefreshTokenCookie_1.setRefreshTokenCookie)(res, token.refreshToken);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.USERS.LOGIN_SUCCESS, { user, accessToken: token.accessToken }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // --------------------------------------------------
    //              🛠 FORGET PASSWORD SENT OTP
    // --------------------------------------------------
    forgetPasswordSentOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validateEmail = emailValidator_1.emailSchema.safeParse(req.body.email);
                if (validateEmail.error) {
                    throw new exceptions_1.InvalidDataException(error_1.Errors.INVALID_EMAIL);
                }
                yield this._forgetPasswordUseCase.sendOtp(validateEmail.data);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.OTP.OTP_SUCCESSFULL, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                console.log('err', error);
                next(error);
            }
        });
    }
    // --------------------------------------------------
    //              🛠 FORGET PASSWORD VERIFY OTP
    // --------------------------------------------------
    forgetPasswordVerifyOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = forgetPasswordVerifyOtpValidator_1.forgetPasswordVerifyOtpSchema.safeParse(req.body);
                if (!data.success) {
                    throw new exceptions_1.InvalidDataException(error_1.Errors.INVALID_DATA);
                }
                const token = yield this._forgetPasswordVerifyOtpUseCase.verifyOtp(data.data);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.OTP.OTP_VERIFIED_SUCCESSFULL, token, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // --------------------------------------------------
    //              🛠 FORGET PASSWORD RESET PASSWORD
    // --------------------------------------------------
    forgetPasswordResetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = forgetPasswordResetPasswordValidator_1.forgetPasswordResetPasswordSchema.safeParse(req.body);
                if (!data.success) {
                    throw new exceptions_1.InvalidDataException(error_1.Errors.INVALID_DATA);
                }
                yield this._forgetPasswordResetPasswordUseCase.resetPassword(data.data);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.USERS.PASSWORD_RESET_SUCCESSFULLY, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // --------------------------------------------------
    //              🛠 GOOGLE LOGIN
    // --------------------------------------------------
    googleLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loginData = googleLoginValidator_1.googleLoginSchema.safeParse(req.body);
                if (!loginData.success) {
                    throw new exceptions_1.InvalidDataException(loginData.error.message || error_1.Errors.INVALID_DATA);
                }
                const responseDTO = yield this._googleLoginUseCase.execute(loginData.data);
                const accessToken = yield this._jwtService.createAccessToken({
                    userId: responseDTO._id,
                    role: responseDTO.role,
                });
                const refreshToken = yield this._jwtService.createRefreshToken({
                    userId: responseDTO._id,
                    role: responseDTO.role,
                });
                (0, setRefreshTokenCookie_1.setRefreshTokenCookie)(res, refreshToken);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.USERS.LOGIN_SUCCESS, { user: responseDTO, accessToken: accessToken }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // --------------------------------------------------
    //              🛠 LOGOUT
    // --------------------------------------------------
    handleLogout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.RefreshToken;
                yield this._tokenInvalidationUseCase.refreshToken(refreshToken);
                (0, clearRefreshTokenCookie_1.clearRefreshTokenCookie)(res);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.USERS.LOGOUT_SUCCESS, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.UserAuthController = UserAuthController;
