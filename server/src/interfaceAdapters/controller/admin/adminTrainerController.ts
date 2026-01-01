import { IGetAllTrainerUseCase } from '../../../application/useCase/admin/trainer/IGetAllTrainerUseCase';
import { Errors, USER_ERRORS } from '../../../shared/constants/error';
import { HTTPStatus } from '../../../shared/constants/httpStatus';
import { MESSAGES } from '../../../shared/constants/messages';
import { ResponseHelper } from '../../../shared/utils/responseHelper';
import { InvalidDataException, NotFoundException } from '../../../application/constants/exceptions';
import { NextFunction, Request, Response } from 'express';
import { IUpdateTrainerStatusUseCase } from '../../../application/useCase/admin/trainer/IUpdateTrainerUseCase';

export class AdminTrainerController {
    constructor(
    private _getAllTrainerUseCase: IGetAllTrainerUseCase,
    private _updateTrainerStatusUseCase: IUpdateTrainerStatusUseCase,
    ) {}

    // --------------------------------------------------
    //               LISTING ALL TRAINER
    // --------------------------------------------------

    async getAllTrainer(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
     
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const status = (req.query.status as string) || undefined;
            const search = (req.query.search as string) || undefined;

            if (page < 1 || limit < 1 || limit > 100) {
                throw new InvalidDataException(Errors.INVALID_PAGINATION_PARAMETERS);
            }

            const result = await this._getAllTrainerUseCase.getAllTrainer(page, limit, status, search);

            if (!result || result.users?.length === 0) {
                throw new NotFoundException(USER_ERRORS.NO_USERS_FOUND);
            }

            ResponseHelper.success(res, MESSAGES.USERS.GET_ALL_USERS, { data: result }, HTTPStatus.OK);
        } catch (error) {
            next(error);
        }
    }

    // --------------------------------------------------
    //               CHANGE TRAINER STATUS
    // --------------------------------------------------

    async updateTrainerStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, currentStatus } = req.body;
            if (!userId || !currentStatus) {
                throw new InvalidDataException(Errors.INVALID_CREDENTIALS);
            }

            const result = await this._updateTrainerStatusUseCase.updateTrainerStatus(userId, currentStatus);

            ResponseHelper.success(res, MESSAGES.USERS.STATUS_UPDATED_SUCCESSFULLY, { data: result.user }, HTTPStatus.OK);
        } catch (error) {
            next(error);
        }
    }
}
