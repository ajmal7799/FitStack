import { HTTPStatus } from '../../../shared/constants/httpStatus';
import { MESSAGES } from '../../../shared/constants/messages';
import { ResponseHelper } from '../../../shared/utils/responseHelper';
import { InvalidDataException, NotFoundException } from '../../../application/constants/exceptions';
import { NextFunction, Request, Response } from 'express';
import { Errors, SUBSCRIPTION_ERRORS } from '../../../shared/constants/error';
import { IJoinSessionUseCase } from '../../../application/useCase/video/IJoinSessionUseCase';

export class VideoCallController {
  constructor(private joinSessionUseCase: IJoinSessionUseCase) {}

  async joinVideoSession(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      const { slotId } = req.params;

      const result = await this.joinSessionUseCase.execute(userId!, slotId);
      ResponseHelper.success(res, MESSAGES.USERS.VIDEO_SESSION_JOINED_SUCCESS, { result }, HTTPStatus.OK);
    } catch (error) {
      next(error);
    }
  }
}
