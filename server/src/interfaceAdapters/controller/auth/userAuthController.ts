import { ICreateUserUseCase } from "../../../application/useCase/auth/user/ICreateUserUseCase";
import { registerUserSchema } from "../../../shared/validations/userRegisterValidator";
import { HTTPStatus } from "../../../shared/constants/httpStatus";
import { Errors } from "../../../shared/constants/error";
import { Request, Response } from "express";
import { IVerifyOtpUseCase } from "../../../application/useCase/auth/IVerifyOtp";
import { ISignUpSendOtpUseCase } from "../../../application/useCase/auth/user/ISignUpSendOtp";
import { emailSchema } from "../../../shared/validations/emailValidator";
import { MESSAGES } from "../../../shared/constants/messages";
import { ITokenCreationUseCase } from "../../../application/useCase/auth/ITokenCreation";
import { UserRole } from "../../../domain/enum/userEnums";
import { setRefreshTokenCookie } from "../../../shared/utils/setRefreshTokenCookie";
import { IUserLoginUseCase } from "../../../application/useCase/auth/user/IUserLoginUseCase";
import { success } from "zod";
import { loginSchema } from "../../../shared/validations/loginValidator";



export class UserAuthController {
    constructor(
        private _registerUseCase: ICreateUserUseCase,
        private _sendOtpUseCase: ISignUpSendOtpUseCase,
        private _verifyOtpUseCase: IVerifyOtpUseCase,
        private _tokenCreationUseCase: ITokenCreationUseCase,
        private _userLoginUseCase: IUserLoginUseCase,
    ) { }

    async signUpSendOtp(req: Request, res: Response): Promise<void> {
        try {
            const validateEmail = emailSchema.safeParse(req.body.email)
            if (!validateEmail) {
                throw new Error(Errors.INVALID_EMAIL)
            }

            await this._sendOtpUseCase.signUpSendOtp(validateEmail.data!)

            res.status(HTTPStatus.OK).json({ message: MESSAGES.OTP.OTP_SUCCESSFULL })

        } catch (error) {
            console.log(error);
            res.status(HTTPStatus.BAD_REQUEST).json({ messsage: Errors.OTP_ERROR, error });
        }
    }

    async registerUser(req: Request, res: Response): Promise<void> {
        try {
            const userData = registerUserSchema.safeParse(req.body);
            // console.log("userdata : ", userData);
            if (!userData.success) {
                res.status(HTTPStatus.BAD_REQUEST).json({ message: Errors.INVALID_USERDATA });
                return;
            }

            const { email, name, password, phone, otp } = userData.data!;
            console.log("OTP:", otp)

            const verifiedOtp = await this._verifyOtpUseCase.verifyOtp(email, otp)

            if (!verifiedOtp) {
                res.status(HTTPStatus.BAD_REQUEST).json({ message: Errors.OTP_VERIFICATION_FAILED });
                return;
            }



            const user = await this._registerUseCase.createUser({ name, email, password, phone })
            const token = this._tokenCreationUseCase.createAccessTokenAndRefreshToken({
                userId: user._id.toString(),
                role: UserRole.USER,
            })
            console.log("token", token)
            console.log("user after creating : ", user);

            setRefreshTokenCookie(res, token.refreshToken)

            res.status(HTTPStatus.OK).json({
                success: true,
                message: "Signup successfull",
                data: { user, accessToken: token.accessToken }
            });

        } catch (error) {
            res
                .status(HTTPStatus.BAD_REQUEST)
                .json({ success: false, message: error instanceof Error ? error.message : "Server Error" });
        }
    }

    async loginUser(req: Request, res: Response): Promise<void> {
        try {

            const { email, password } = loginSchema.parse(req.body)
            console.log("email,password", email, password)

            const user = await this._userLoginUseCase.userLogin(email, password)
            console.log(user)

            const token = this._tokenCreationUseCase.createAccessTokenAndRefreshToken({
                userId: user._id.toString(),
                role: UserRole.USER
            })
            console.log("after login create token", token)

            setRefreshTokenCookie(res, token.refreshToken)

            res.status(HTTPStatus.OK).json({
                success: true,
                message: "Login successfull",
                data: { user, accessToken: token.accessToken }
            })


        } catch (error) {
            res.status(HTTPStatus.BAD_REQUEST).json({
                message: Errors.INVALID_CREDENTIALS,
                error: error instanceof Error ? error.message : "Error while validating user",
            });
        }
    }

    
}