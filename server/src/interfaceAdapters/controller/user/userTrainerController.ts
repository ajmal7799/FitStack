import { HTTPStatus } from '../../../shared/constants/httpStatus';
import { MESSAGES } from '../../../shared/constants/messages';
import { ResponseHelper } from '../../../shared/utils/responseHelper';
import { InvalidDataException, NotFoundException } from '../../../application/constants/exceptions';
import { NextFunction, Request, Response } from 'express';
import { Errors, SUBSCRIPTION_ERRORS, USER_ERRORS } from '../../../shared/constants/error';
import { IGetAllTrainerUseCase } from '../../../application/useCase/user/trainer/IGetAllTrainers';
import { IGetTrainerDetailsUseCase } from '../../../application/useCase/user/trainer/IGetTrainerDetailsUseCase';
import { ITrainerSelectUseCase } from '../../../application/useCase/user/trainer/ITrainerSelectUseCase';
import { IGetSelectedTrainer } from '../../../application/useCase/user/trainer/IGetSelectedTrainer';

export class UserTrainerController {
    constructor(
    private _getAllTrainerUseCase: IGetAllTrainerUseCase,
    private _getTrainerDetailsUseCase: IGetTrainerDetailsUseCase,
    private _trainerSelectUseCase: ITrainerSelectUseCase,
    private _getSelectedTrainerUseCase: IGetSelectedTrainer,
    ) {}
    async getAllTrainer(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new InvalidDataException(Errors.INVALID_DATA);
            }
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = (req.query.search as string) || undefined;
            
            

            if (page < 1 || limit < 1 || limit > 100) {
                throw new InvalidDataException(Errors.INVALID_PAGINATION_PARAMETERS);
            }

            const result = await this._getAllTrainerUseCase.getAllTrainer(page, limit, search, userId);
            

            if (!result || result.verifications?.length === 0) {
                throw new NotFoundException(USER_ERRORS.NO_USERS_FOUND);
            }
            ResponseHelper.success(res, MESSAGES.Trainer.VERIFICATION_DATA_SUCCESS, { data: result }, HTTPStatus.OK);
        } catch (error) {
            next(error);
        }
    }

    async getTrainerDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const { trainerId } = req.params;

            if (!trainerId) {
                throw new InvalidDataException(Errors.INVALID_DATA);
            }
            const result = await this._getTrainerDetailsUseCase.getTrainerDetails(trainerId);

            ResponseHelper.success(res, MESSAGES.Trainer.TRAINER_DETAILS_SUCCESS, { result }, HTTPStatus.OK);
        } catch (error) {
            next(error);
        }
    }

    async selectTrainer(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;
            const { trainerId } = req.body;

            if (!userId || !trainerId) {
                throw new InvalidDataException(Errors.INVALID_DATA);
            }

            await this._trainerSelectUseCase.selectTrainer(userId, trainerId);

            ResponseHelper.success(res, MESSAGES.Trainer.TRAINER_SELECTED_SUCCESS, HTTPStatus.OK);

        } catch (error) {
            next(error);
        }
    }
    async getSelectedTrainer(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                throw new InvalidDataException(Errors.INVALID_DATA);
            }

            const result = await this._getSelectedTrainerUseCase.getSelectedTrainer(userId);

            ResponseHelper.success(res, MESSAGES.Trainer.GET_SELECTED_TRAINER, { result }, HTTPStatus.OK);
      
        } catch (error) {
            next(error);
        }
    }
    

}
