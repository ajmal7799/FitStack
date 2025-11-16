// import { Request, Response } from "express";
// import { IUpdateProfileUseCase } from "../../../application/useCase/user/IUpdateProfileUseCase";
// import { updateProfileSchema } from "../../../shared/validations/updateProfileSchema";
// import { Errors } from "../../../shared/constants/error";
// import { HTTPStatus } from "../../../shared/constants/httpStatus";
// import { UpdateProfileDTO } from "../../../application/dto/user/updateProfileDTO";
// import {MESSAGES} from '../../../shared/constants/messages'

// export class UserProfileController {
//     private _updateProfileUseCase: IUpdateProfileUseCase

//     constructor(updateProfileUseCase: IUpdateProfileUseCase) {
//         this._updateProfileUseCase = updateProfileUseCase
//     }

//     async updateProfile(req: Request, res: Response): Promise<void> {
//         try {
//               const userId = (req as any).user?.userId

//               if (!userId) {
//                 res.status(HTTPStatus.UNAUTHORIZED).json({ success: false, message: Errors.INVALID_TOKEN });
//                 return;
//             }

//               const result = updateProfileSchema.safeParse(req.body);
//             if (!result.success) {
//                 res.status(HTTPStatus.BAD_REQUEST).json({
//                     success: false,
//                     message: Errors.INVALID_DATA,
//                     errors: result.error
//                 });
//                 return;
//             }

//               const validatedData: UpdateProfileDTO = result.data;
            
//              const updatedUser = await this._updateProfileUseCase.updateProfile(userId, validatedData);

//             res.status(HTTPStatus.OK).json({
//                 success: true,
//                 data: updatedUser,
//                 message: MESSAGES.USERS.LOGIN_SUCCESS
//             });


//         } catch (error) {
//              res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
//                 success: false,
//                 message: error instanceof Error ? error.message : Errors.INTERNAL_SERVER_ERROR
//             });

//         }

//     }
// }