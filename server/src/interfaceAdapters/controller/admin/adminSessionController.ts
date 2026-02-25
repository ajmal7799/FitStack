import { Errors, USER_ERRORS } from '../../../shared/constants/error';
import { HTTPStatus } from '../../../shared/constants/httpStatus';
import { MESSAGES } from '../../../shared/constants/messages';
import { ResponseHelper } from '../../../shared/utils/responseHelper';
import { InvalidDataException, NotFoundException } from '../../../application/constants/exceptions';
import { NextFunction, Request, Response } from 'express';
import { ISessionHistoryUseCase } from '../../../application/useCase/admin/session/ISessionHistoryUseCase';
import { ISessionAdminHistoryUseCase } from '../../../application/useCase/admin/session/ISessionAdminHistoryUseCase';


export class AdminSessionController {
    constructor(
        private _sessionHistoryUseCase: ISessionHistoryUseCase,
        private _sessionAdminHistoryUseCase: ISessionAdminHistoryUseCase

    ) {}

    async getAllSessions(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const status = (req.query.status as string) || undefined;
            const search = (req.query.search as string) || undefined;

            if (page < 1 || limit < 1 || limit > 100) {
                throw new InvalidDataException(Errors.INVALID_PAGINATION_PARAMETERS);
            }

            const result = await this._sessionHistoryUseCase.getSessionHistory(page, limit, status, search);
            ResponseHelper.success(res, MESSAGES.USERS.SESSION_HISTORY_FETCHED_SUCCESS, {result}, HTTPStatus.OK);
        } catch (error) {
            next(error);
        }
    }

    async getSessionDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const { sessionId } = req.params;

            if (!sessionId) {
                throw new InvalidDataException(Errors.INVALID_DATA);
            }
            const result = await this._sessionAdminHistoryUseCase.getSessionHistoryDetails(sessionId);
            ResponseHelper.success(res, MESSAGES.USERS.SESSION_HISTORY_DETAILS_FETCHED_SUCCESS, {result}, HTTPStatus.OK);
        } catch (error) {
            next(error);
        }
    }


}