import { HTTPStatus } from '../../../shared/constants/httpStatus';
import { MESSAGES } from '../../../shared/constants/messages';
import { ResponseHelper } from '../../../shared/utils/responseHelper';
import { InvalidDataException, NotFoundException } from '../../../application/constants/exceptions';
import { NextFunction, Request, Response } from 'express';
import { Errors, SUBSCRIPTION_ERRORS, USER_ERRORS } from '../../../shared/constants/error';
import { IGenerateDietPlanUseCase } from '../../../application/useCase/user/IGenerateDietPlanUseCase';
import { IGetDietPlanUseCase } from '../../../application/useCase/user/IGetDietPlanUseCase';

export class UserGenerateDietPlanController {
    constructor(
    private _generateDietPlanUseCase: IGenerateDietPlanUseCase,
    private _getDietPlanUseCase: IGetDietPlanUseCase,
    ) {}

    async handleDietPlan(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                throw new InvalidDataException(USER_ERRORS.NO_USERS_FOUND);
            }

            const result = await this._generateDietPlanUseCase.generateDietPlan(userId);
      

            ResponseHelper.success(res, MESSAGES.USERS.DIET_PLAN_CREATED_SUCCESSFULLY, { result }, HTTPStatus.OK);
        } catch (error) {
            next(error);
        }
    }

    async getDietPlan(req: Request, res: Response, next: NextFunction) {
        try {
      
            const userId = req.user?.userId;

            if (!userId) {
                throw new NotFoundException(USER_ERRORS.NO_USERS_FOUND);
            }
            const result = await this._getDietPlanUseCase.excute(userId);
      
            ResponseHelper.success(res, MESSAGES.USERS.GET_DIET_PLAN, { result }, HTTPStatus.OK);

        } catch (error) {
            next(error);
        }
    }
}
