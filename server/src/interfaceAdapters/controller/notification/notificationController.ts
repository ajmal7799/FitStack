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
import { IGetNotificationsUseCase } from '../../../application/useCase/notification/IGetNotificationsUseCase';
import { IMarkAsReadUseCase } from '../../../application/useCase/notification/IMarkAsReadUseCase';

export class NotificationController {
    constructor(
        private _getNotificationsUseCase: IGetNotificationsUseCase,
        private _markAsReadUseCase: IMarkAsReadUseCase
    ) {}

    async getNotifications(req: Request, res: Response, next: NextFunction) {
        const userId = req.user?.userId;
        const result = await this._getNotificationsUseCase.execute(userId!);

        ResponseHelper.success(res, MESSAGES.NOTIFICATION.GET_NOTIFICATIONS_SUCCESS,  result , HTTPStatus.OK);

    }

    async markAsRead(req: Request, res: Response, next: NextFunction) {
        const {notificationId} = req.params;
        const result = await this._markAsReadUseCase.markOne(notificationId);
        ResponseHelper.success(res, MESSAGES.NOTIFICATION.MARK_AS_READ_SUCCESS, result, HTTPStatus.OK);
    }

    async markAllAsRead(req: Request, res: Response, next: NextFunction) {
        const userId = req.user?.userId;

        const result = await this._markAsReadUseCase.markAll(userId!);
        ResponseHelper.success(res, MESSAGES.NOTIFICATION.MARK_ALL_AS_READ_SUCCESS, result, HTTPStatus.OK);
    }

    async clearAll(req: Request, res: Response, next: NextFunction) {
        const userId = req.user?.userId;
        await this._markAsReadUseCase.clearAll(userId!);
        ResponseHelper.success(res, MESSAGES.NOTIFICATION.CLEAR_ALL_SUCCESS, null, HTTPStatus.OK);
    }
}
