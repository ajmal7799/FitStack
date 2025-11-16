import { success } from "zod";
import { IAdminLoginUseCase } from "../../../application/useCase/auth/admin/IAdminLoginUseCase";
import { ITokenCreationUseCase } from "../../../application/useCase/auth/ITokenCreation";
import { UserRole } from "../../../domain/enum/userEnums";
import { Errors } from "../../../shared/constants/error";
import { HTTPStatus } from "../../../shared/constants/httpStatus";
import { setRefreshTokenCookie } from "../../../shared/utils/setRefreshTokenCookie";
import { loginSchema } from "../../../shared/validations/loginValidator";
import { NextFunction, Request, Response } from "express";
import { MESSAGES } from "../../../shared/constants/messages";
import { ResponseHelper } from "../../../shared/utils/responseHelper";





export class AdminAuthController {
    constructor(private _adminLoginUseCase: IAdminLoginUseCase, private _tokenCreationUseCase: ITokenCreationUseCase) { }

    async adminLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { email, password } = loginSchema.parse(req.body)
            console.log("email", email, password)

            const user = await this._adminLoginUseCase.adminLogin(email, password)

            const token = this._tokenCreationUseCase.createAccessTokenAndRefreshToken({
                userId: user._id.toString(),
                role: UserRole.ADMIN,
            })

            setRefreshTokenCookie(res, token.refreshToken);

            ResponseHelper.success(
                res,
                MESSAGES.USERS.LOGIN_SUCCESS,
                { user, accessToken: token.accessToken },
                HTTPStatus.OK
            )

        } catch (error) {
            // console.error("Admin login error:", error);
            next(error)

        }
    }
}