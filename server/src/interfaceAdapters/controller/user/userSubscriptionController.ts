import { HTTPStatus } from '../../../shared/constants/httpStatus';
import { MESSAGES } from '../../../shared/constants/messages';
import { ResponseHelper } from '../../../shared/utils/responseHelper';
import { InvalidDataException,NotFoundException } from '../../../application/constants/exceptions';
import { NextFunction, Request, Response } from 'express';
import { Errors, SUBSCRIPTION_ERRORS } from '../../../shared/constants/error';
import { IGetAllSubscriptionUser } from '../../../application/useCase/user/subscription/IGetAllSubscription';

export class UserSubscriptionController {
    constructor(
        private _getAllSubscriptionUseCase: IGetAllSubscriptionUser
    ) { }


   async getAllSubscriptionPlans(req: Request, res: Response, next: NextFunction) {
    try {
        
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        if (page < 1 || limit < 1 || limit > 100) {
            throw new InvalidDataException(Errors.INVALID_PAGINATION_PARAMETERS);
        }

        const result = await this._getAllSubscriptionUseCase.getAllSubscription(page, limit);

        if (!result || result.subscriptions?.length === 0) {
            throw new NotFoundException(SUBSCRIPTION_ERRORS.NO_SUBSCRIPTIONS_FOUND);
        }
        // console.log("result", result);
        ResponseHelper.success(res, MESSAGES.SUBSCRIPTION.SUBSCRIPTION_GET_SUCCESS, { data: result }, HTTPStatus.OK);
        
    } catch (error) {
        next(error);
    }
   }
}