import { ICreateUserUseCase } from '../../../application/useCase/auth/user/ICreateUserUseCase';
import { registerUserSchema } from '../../../shared/validations/userRegisterValidator';
import { HTTPStatus } from '../../../shared/constants/httpStatus';
import { Errors } from '../../../shared/constants/error';
import { NextFunction, Request, Response } from 'express';
import { IVerifyOtpUseCase } from '../../../application/useCase/auth/IVerifyOtp';
import { ISignUpSendOtpUseCase } from '../../../application/useCase/auth/user/ISignUpSendOtp';
import { emailSchema } from '../../../shared/validations/emailValidator';
import { MESSAGES } from '../../../shared/constants/messages';
import { ITokenCreationUseCase } from '../../../application/useCase/auth/ITokenCreation';
import { UserRole } from '../../../domain/enum/userEnums';
import { setRefreshTokenCookie } from '../../../shared/utils/setRefreshTokenCookie';
import { IUserLoginUseCase } from '../../../application/useCase/auth/user/IUserLoginUseCase';
import { loginSchema } from '../../../shared/validations/loginValidator';
import { ResponseHelper } from '../../../shared/utils/responseHelper';
import { ITokenInvalidationUseCase } from '../../../application/useCase/auth/ITokenInvalidationUseCase';
import { clearRefreshTokenCookie } from '../../../shared/utils/clearRefreshTokenCookie';
import { InvalidDataException } from '../../../application/constants/exceptions';
import { IResendOtpUseCase } from '../../../application/useCase/auth/IResendOtp';
import { IForgetPasswordSentOtpUseCase } from '../../../application/useCase/auth/IForgetPasswordSentOtp';
import { IForgetPasswordVerifyOtp } from '../../../application/useCase/auth/IForgetPasswordVerifyOtp';
import { forgetPasswordVerifyOtpSchema } from '../../../shared/validations/forgetPasswordVerifyOtpValidator';
import { IForgetPasswordResetPassword } from '../../../application/useCase/auth/IForgetPasswordResetPassword';
import { forgetPasswordResetPasswordSchema } from '../../../shared/validations/forgetPasswordResetPasswordValidator';
import { googleLoginSchema } from '../../../shared/validations/googleLoginValidator';
import { IGoogleLoginUseCase } from '../../../application/useCase/auth/IGoogleLoginUseCase';
import { IJWTService } from '../../../domain/interfaces/services/IJWTService';
import { IRefreshTokenUseCase } from '../../../application/useCase/auth/IRefreshToken';
import { IChangePasswordUseCase } from '../../../application/useCase/auth/IChangePasswordUseCase';

export class UserAuthController {
    constructor(
    private _registerUseCase: ICreateUserUseCase,
    private _sendOtpUseCase: ISignUpSendOtpUseCase,
    private _verifyOtpUseCase: IVerifyOtpUseCase,
    private _tokenCreationUseCase: ITokenCreationUseCase,
    private _userLoginUseCase: IUserLoginUseCase,
    private _tokenInvalidationUseCase: ITokenInvalidationUseCase,
    private _resendOtpUseCase: IResendOtpUseCase,
    private _forgetPasswordUseCase: IForgetPasswordSentOtpUseCase,
    private _forgetPasswordVerifyOtpUseCase: IForgetPasswordVerifyOtp,
    private _forgetPasswordResetPasswordUseCase: IForgetPasswordResetPassword,
    private _googleLoginUseCase: IGoogleLoginUseCase,
    private _jwtService: IJWTService,
    private _tokenRefreshUseCase: IRefreshTokenUseCase,
    private _changePasswordUseCase: IChangePasswordUseCase,
    ) {}

    // --------------------------------------------------
    //               SINGUP SEND OTP
    // --------------------------------------------------

    async signUpSendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            const validateEmail = emailSchema.safeParse(req.body.email);
            if (!validateEmail) {
                throw new Error(Errors.INVALID_EMAIL);
            }

            await this._sendOtpUseCase.signUpSendOtp(validateEmail.data!);

            ResponseHelper.success(res, MESSAGES.OTP.OTP_SUCCESSFULL, HTTPStatus.OK);
        } catch (error) {
            next(error);
        }
    }

    // --------------------------------------------------
    //               REGISTER USER
    // --------------------------------------------------

    async registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userData = registerUserSchema.safeParse(req.body);

            if (!userData.success) {
                res.status(HTTPStatus.BAD_REQUEST).json({ message: Errors.INVALID_USERDATA });
                return;
            }

            const { email, name, password, phone, otp, role } = userData.data!;
            console.log('OTP:', otp);

            const verifiedOtp = await this._verifyOtpUseCase.verifyOtp(email, otp);

            if (!verifiedOtp) {
                res.status(HTTPStatus.BAD_REQUEST).json({ message: Errors.OTP_VERIFICATION_FAILED });
                return;
            }

            const user = await this._registerUseCase.createUser({ name, email, password, phone, role });
            const token = this._tokenCreationUseCase.createAccessTokenAndRefreshToken({
                userId: user._id!.toString(),
                role: UserRole.USER,
            });

            setRefreshTokenCookie(res, token.refreshToken);

            ResponseHelper.success(
                res,
                MESSAGES.USERS.REGISTER_SUCCESS,
                { user, accessToken: token.accessToken },
                HTTPStatus.OK,
            );
        } catch (error) {
            next(error);
        }
    }

    // --------------------------------------------------
    //               RESEND OTP
    // --------------------------------------------------

    async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validatedEmail = emailSchema.safeParse(req.body.email);

            if (validatedEmail.error) {
                throw new InvalidDataException(Errors.INVALID_EMAIL);
            }

            await this._resendOtpUseCase.resendOtp(validatedEmail.data);

            ResponseHelper.success(res, MESSAGES.OTP.RESEND_OTP_SUCCESSFULL, HTTPStatus.OK);
        } catch (error) {
            next(error);
        }
    }

    // --------------------------------------------------
    //               LOGIN USER
    // --------------------------------------------------

    async loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = loginSchema.parse(req.body);

            const user = await this._userLoginUseCase.userLogin(email, password);

            const token = this._tokenCreationUseCase.createAccessTokenAndRefreshToken({
                userId: user._id.toString(),
                role: UserRole.USER,
            });

            setRefreshTokenCookie(res, token.refreshToken);

            ResponseHelper.success(
                res,
                MESSAGES.USERS.LOGIN_SUCCESS,
                { user, accessToken: token.accessToken },
                HTTPStatus.OK,
            );
        } catch (error) {
            next(error);
        }
    }

    // --------------------------------------------------
    //              🛠 FORGET PASSWORD SENT OTP
    // --------------------------------------------------

    async forgetPasswordSentOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validateEmail = emailSchema.safeParse(req.body.email);

            if (validateEmail.error) {
                throw new InvalidDataException(Errors.INVALID_EMAIL);
            }

            await this._forgetPasswordUseCase.sendOtp(validateEmail.data!);
            ResponseHelper.success(res, MESSAGES.OTP.OTP_SUCCESSFULL, HTTPStatus.OK);
        } catch (error) {
            console.log('err', error);
            next(error);
        }
    }

    // --------------------------------------------------
    //              🛠 FORGET PASSWORD VERIFY OTP
    // --------------------------------------------------

    async forgetPasswordVerifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = forgetPasswordVerifyOtpSchema.safeParse(req.body);
            if (!data.success) {
                throw new InvalidDataException(Errors.INVALID_DATA);
            }

            const token = await this._forgetPasswordVerifyOtpUseCase.verifyOtp(data.data!);

            ResponseHelper.success(res, MESSAGES.OTP.OTP_VERIFIED_SUCCESSFULL, token, HTTPStatus.OK);
        } catch (error) {
            next(error);
        }
    }

    // --------------------------------------------------
    //              🛠 FORGET PASSWORD RESET PASSWORD
    // --------------------------------------------------

    async forgetPasswordResetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = forgetPasswordResetPasswordSchema.safeParse(req.body);
            if (!data.success) {
                throw new InvalidDataException(Errors.INVALID_DATA);
            }

            await this._forgetPasswordResetPasswordUseCase.resetPassword(data.data!);

            ResponseHelper.success(res, MESSAGES.USERS.PASSWORD_RESET_SUCCESSFULLY, HTTPStatus.OK);
        } catch (error) {
            next(error);
        }
    }

    // --------------------------------------------------
    //              🛠 GOOGLE LOGIN
    // --------------------------------------------------

    async googleLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const loginData = googleLoginSchema.safeParse(req.body);

            if (!loginData.success) {
                throw new InvalidDataException(loginData.error.message || Errors.INVALID_DATA);
            }

            const responseDTO = await this._googleLoginUseCase.execute(loginData.data);

            const accessToken = await this._jwtService.createAccessToken({
                userId: responseDTO._id,
                role: responseDTO.role,
            });

            const refreshToken = await this._jwtService.createRefreshToken({
                userId: responseDTO._id,
                role: responseDTO.role,
            });

            setRefreshTokenCookie(res, refreshToken);

            ResponseHelper.success(
                res,
                MESSAGES.USERS.LOGIN_SUCCESS,
                { user: responseDTO, accessToken: accessToken },
                HTTPStatus.OK,
            );
        } catch (error) {
            next(error);
        }
    }

    // --------------------------------------------------
    //              🛠 HANDLE REFRESH TOKEN
    // --------------------------------------------------

  async handleRefreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        // ✅ Fix: was 'refreshToken' (lowercase), cookie is set as 'RefreshToken'
        const refreshToken = req.cookies.RefreshToken;

        if (!refreshToken) {
            res.status(HTTPStatus.UNAUTHORIZED).json({
                success: false,
                message: 'Refresh token missing'
            });
            return;
        }

        const accessToken = await this._tokenRefreshUseCase.refresh(refreshToken);

        res.status(HTTPStatus.OK).json({
            success: true,
            message: MESSAGES.REFRESH_TOKEN.REFRESH_SUCCESSFUL,
            accessToken
        });
    } catch (error) {
        // ✅ If refresh token expired → force logout
        clearRefreshTokenCookie(res);
        res.status(HTTPStatus.UNAUTHORIZED).json({
            success: false,
            message: 'Session expired. Please login again.'
        });
    }
}


    // --------------------------------------------------
    //              🛠 PASSWORD CHANGE
    // --------------------------------------------------


    async handlePasswordChange(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log("reached here");    
            const userId = req.user?.userId;
            const { oldPassword, newPassword } = req.body;

            if (!userId || !oldPassword || !newPassword) {
                throw new InvalidDataException(Errors.INVALID_DATA);
            }

            await this._changePasswordUseCase.changePassword(userId, oldPassword, newPassword);

            ResponseHelper.success(res, MESSAGES.USERS.PASSWORD_CHANGE_SUCCESSFULLY, HTTPStatus.OK);
            
        } catch (error) {
            next(error);
        }
    }




    // --------------------------------------------------
    //              🛠 LOGOUT
    // --------------------------------------------------

    async handleLogout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const refreshToken = req.cookies.RefreshToken;

            await this._tokenInvalidationUseCase.refreshToken(refreshToken);

            clearRefreshTokenCookie(res);

            ResponseHelper.success(res, MESSAGES.USERS.LOGOUT_SUCCESS, HTTPStatus.OK);
        } catch (error) {
            next(error);
        }
    }
}
