import { ICreateUserUseCase } from "../../../application/useCase/auth/user/ICreateUserUseCase";
import { registerUserSchema } from "../../../shared/validations/userRegisterValidator";
import { HTTPStatus } from "../../../shared/constants/httpStatus";
import { Errors } from "../../../shared/constants/error";
import { NextFunction, Request, Response } from "express";
import { IVerifyOtpUseCase } from "../../../application/useCase/auth/IVerifyOtp";
import { ISignUpSendOtpUseCase } from "../../../application/useCase/auth/user/ISignUpSendOtp";
import { emailSchema } from "../../../shared/validations/emailValidator";
import { MESSAGES } from "../../../shared/constants/messages";
import { ITokenCreationUseCase } from "../../../application/useCase/auth/ITokenCreation";
import { UserRole } from "../../../domain/enum/userEnums";
import { setRefreshTokenCookie } from "../../../shared/utils/setRefreshTokenCookie";
import { IUserLoginUseCase } from "../../../application/useCase/auth/user/IUserLoginUseCase";
import { loginSchema } from "../../../shared/validations/loginValidator";
import { ResponseHelper } from "../../../shared/utils/responseHelper";
import { ITokenInvalidationUseCase } from "../../../application/useCase/auth/ITokenInvalidationUseCase";
import { clearRefreshTokenCookie } from "../../../shared/utils/clearRefreshTokenCookie";
import { InvalidDataException } from "../../../application/constants/exceptions";
import { IResendOtpUseCase } from "../../../application/useCase/auth/IResendOtp";


export class UserAuthController {
    constructor(
        private _registerUseCase: ICreateUserUseCase,
        private _sendOtpUseCase: ISignUpSendOtpUseCase,
        private _verifyOtpUseCase: IVerifyOtpUseCase,
        private _tokenCreationUseCase: ITokenCreationUseCase,
        private _userLoginUseCase: IUserLoginUseCase,
        private _tokenInvalidationUseCase: ITokenInvalidationUseCase,
        private _resendOtpUseCase: IResendOtpUseCase
    ) { }

    async signUpSendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const validateEmail = emailSchema.safeParse(req.body.email)
            if (!validateEmail) {
                throw new Error(Errors.INVALID_EMAIL)
            }

            await this._sendOtpUseCase.signUpSendOtp(validateEmail.data!)

            ResponseHelper.success(res, MESSAGES.OTP.OTP_SUCCESSFULL, HTTPStatus.OK)

        } catch (error) {
            next(error)
        }
    }

    async registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userData = registerUserSchema.safeParse(req.body);

            if (!userData.success) {
                res.status(HTTPStatus.BAD_REQUEST).json({ message: Errors.INVALID_USERDATA });
                return;
            }

            const { email, name, password, phone, otp, role } = userData.data!;
            console.log("OTP:", otp)

            const verifiedOtp = await this._verifyOtpUseCase.verifyOtp(email, otp)

            if (!verifiedOtp) {
                res.status(HTTPStatus.BAD_REQUEST).json({ message: Errors.OTP_VERIFICATION_FAILED });
                return;
            }

            const user = await this._registerUseCase.createUser({ name, email, password, phone, role })
            const token = this._tokenCreationUseCase.createAccessTokenAndRefreshToken({
                userId: user._id.toString(),
                role: role || UserRole.USER,
            })

            setRefreshTokenCookie(res, token.refreshToken)

            ResponseHelper.success(
                res,
                MESSAGES.USERS.REGISTER_SUCCESS,
                { user, accessToken: token.accessToken },
                HTTPStatus.OK
            )

        } catch (error) {
            next(error)
        }
    }


    async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log("resendotp")
            const validatedEmail = emailSchema.safeParse(req.body.email);

            if (validatedEmail.error) {
                throw new InvalidDataException(Errors.INVALID_EMAIL);
            }

            await this._resendOtpUseCase.resendOtp(validatedEmail.data)

            ResponseHelper.success(res, MESSAGES.OTP.RESEND_OTP_SUCCESSFULL, HTTPStatus.OK)

        } catch (error) {
            next(error)
        }

    }

    async loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { email, password } = loginSchema.parse(req.body)

            const user = await this._userLoginUseCase.userLogin(email, password)


            const token = this._tokenCreationUseCase.createAccessTokenAndRefreshToken({
                userId: user._id.toString(),
                role: UserRole.USER
            })
            console.log("after login create token", token)

            setRefreshTokenCookie(res, token.refreshToken)

            ResponseHelper.success(
                res,
                MESSAGES.USERS.LOGIN_SUCCESS,
                { user, accessToken: token.accessToken },
                HTTPStatus.OK
            );

        } catch (error) {
            next(error)
        }
    }


    async handleLogout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const refreshToken = req.cookies.RefreshToken;


            await this._tokenInvalidationUseCase.refreshToken(refreshToken)

            clearRefreshTokenCookie(res)

            ResponseHelper.success(res, MESSAGES.USERS.LOGOUT_SUCCESS, HTTPStatus.OK)
        } catch (error) {
            next(error);
        }
    }
}