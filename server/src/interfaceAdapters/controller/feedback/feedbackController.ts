import { HTTPStatus } from '../../../shared/constants/httpStatus';
import { MESSAGES } from '../../../shared/constants/messages';
import { ResponseHelper } from '../../../shared/utils/responseHelper';
import {
  InvalidDataException,
  NotFoundException,
  DataMissingExecption,
} from '../../../application/constants/exceptions';
import { NextFunction, Request, Response } from 'express';
import { Errors, SUBSCRIPTION_ERRORS } from '../../../shared/constants/error';
import { ICreateFeedback } from '../../../application/useCase/feedback/ICreateFeedback';

export class FeedbackController {
  constructor(private _createFeedbackUseCase: ICreateFeedback) {}

  async createfeedback(req: Request, res: Response, next: NextFunction) {
    try {
        console.log("reached here");
      const userId = req.user?.userId;

      const { sessionId, rating, review } = req.body;

      if (!sessionId || !rating) {
        throw new DataMissingExecption('SessionId and rating required');
      }

      const result = await this._createFeedbackUseCase.createFeedback(userId!, sessionId, rating, review);

      ResponseHelper.success(res, MESSAGES.USERS.FEEDBACK_CREATED_SUCCESS, { result }, HTTPStatus.OK);
    } catch (error) {
      next(error);
    }
  }
}
