import { HTTPStatus } from '../../../shared/constants/httpStatus';
import { MESSAGES } from '../../../shared/constants/messages';
import { ResponseHelper } from '../../../shared/utils/responseHelper';
import { InvalidDataException, NotFoundException } from '../../../application/constants/exceptions';
import { NextFunction, Request, Response } from 'express';
import { Errors, SUBSCRIPTION_ERRORS } from '../../../shared/constants/error';
import { IGetAllTrainerUseCase } from '../../../application/useCase/user/trainer/IGetAllTrainers';
import { USER_ERRORS } from '../../../shared/constants/error';

export class UserTrainerController {
  constructor(private _getAllTrainerUseCase: IGetAllTrainerUseCase) {}

  async getAllTrainer(req: Request, res: Response, next: NextFunction) {
    try {
      
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (page < 1 || limit < 1 || limit > 100) {
        throw new InvalidDataException(Errors.INVALID_PAGINATION_PARAMETERS);
      }

      const result = await this._getAllTrainerUseCase.getAllTrainer(page, limit);

      if (!result || result.verifications?.length === 0) {
        throw new NotFoundException(USER_ERRORS.NO_USERS_FOUND);
      }
      ResponseHelper.success(res, MESSAGES.Trainer.VERIFICATION_DATA_SUCCESS, { data: result }, HTTPStatus.OK);
    } catch (error) {
      next(error);
    }
  }
}
