import { HTTPStatus } from '../../../shared/constants/httpStatus';
import { MESSAGES } from '../../../shared/constants/messages';
import { ResponseHelper } from '../../../shared/utils/responseHelper';
import { InvalidDataException, NotFoundException } from '../../../application/constants/exceptions';
import { NextFunction, Request, Response } from 'express';
import { Errors, SUBSCRIPTION_ERRORS, USER_ERRORS } from '../../../shared/constants/error';
import { IGenerateWorkoutPlanUseCase } from '../../../application/useCase/user/IGenerateWorkoutPlanUseCase';
import { IGetWorkoutPlanUseCase } from '../../../application/useCase/user/IGetWorkoutPlanUseCase';

export class UserGenerateWorkoutplanController {
    constructor(
    private  _generateWorkoutplanUseCase: IGenerateWorkoutPlanUseCase,
    private _getWorkoutPlanUseCase: IGetWorkoutPlanUseCase,
    ) {}

    async handleGenerateWorkoutplan(req: Request, res: Response, next: NextFunction) {
        try {
            console.log('reched here ');
            const userId = req.user?.userId;

            if (!userId) {
                throw new InvalidDataException(USER_ERRORS.NO_USERS_FOUND);
            }
      
            const result = await this._generateWorkoutplanUseCase.generateWorkoutPlan(userId);
            console.log('result', result);

            ResponseHelper.success(res, MESSAGES.USERS.WORKOUT_PLAN_CREATED_SUCCESSFULLY, { result }, HTTPStatus.OK);
        
     
        } catch (error) {
            next(error);
        }
    }

    async getWorkoutPlan(req: Request, res: Response, next: NextFunction) {
        try {
            console.log('reched here ');

            const userId = req.user?.userId;
            if (!userId) {
                throw new NotFoundException(USER_ERRORS.NO_USERS_FOUND);
            }
            const result = await this._getWorkoutPlanUseCase.execute(userId);
    
            ResponseHelper.success(res, MESSAGES.USERS.GET_WORKOUT_PLAN, { result }, HTTPStatus.OK);
        } catch (error) {
            next(error);
        }
    }

}
