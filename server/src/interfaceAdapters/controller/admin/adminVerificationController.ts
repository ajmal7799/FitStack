import { Errors, USER_ERRORS } from '../../../shared/constants/error';
import { HTTPStatus } from '../../../shared/constants/httpStatus';
import { MESSAGES } from '../../../shared/constants/messages';
import { ResponseHelper } from '../../../shared/utils/responseHelper';
import {
    DataMissingExecption,
    InvalidDataException,
    NotFoundException,
} from '../../../application/constants/exceptions';
import { NextFunction, Request, Response } from 'express';
import { IGetAllVerificationUseCase } from '../../../application/useCase/admin/verification/IGetAllVerificationUseCase';
import { IGetVerificationDetailsPage } from '../../../application/useCase/admin/verification/IGetVerificationDetailsPage';
import { IVerificationApproveUseCase } from '../../../application/useCase/admin/verification/IVerificationApproveUseCase';
import { IVerificationRejectUseCase } from '../../../application/useCase/admin/verification/IVerificationRejectUseCase';

export class AdminVerificationController {
    constructor(
    private _getAllVerificationUseCase: IGetAllVerificationUseCase,
    private _getVerificationDetailsPage: IGetVerificationDetailsPage,
    private _verificationApproveUseCase: IVerificationApproveUseCase,
    private _verificationRejectUseCase: IVerificationRejectUseCase,
    ) {}

    // --------------------------------------------------
    //              🛠 GET ALL VERIFICATION LIST
    // --------------------------------------------------

    async getAllTrainerVerificationData(req: Request, res: Response, next: NextFunction) {
        try {
            
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const status = (req.query.status as string) || undefined;
            const search = (req.query.search as string) || undefined;
            if (page < 1 || limit < 1 || limit > 100) {
                throw new InvalidDataException(Errors.INVALID_PAGINATION_PARAMETERS);
            }
            const result = await this._getAllVerificationUseCase.getAllVerification(page, limit, status, search);
            
            if (!result || result.verifications?.length === 0) {
                throw new NotFoundException(USER_ERRORS.NO_USERS_FOUND);
            }

            ResponseHelper.success(res, MESSAGES.Trainer.VERIFICATION_DATA_SUCCESS, { data: result }, HTTPStatus.OK);
        } catch (error) {
            next(error);
        }
    }

    // --------------------------------------------------
    //              🛠 VERIFICATION DETAILS PAGE
    // --------------------------------------------------

    async getVerificationDetailsPage(req: Request, res: Response, next: NextFunction) {
        try {
            const trainerId = req.params.trainerId;

            if (!trainerId) {
                throw new DataMissingExecption(Errors.INVALID_DATA);
            }

            const verificationData = await this._getVerificationDetailsPage.execute(trainerId);
            ResponseHelper.success(res, MESSAGES.Trainer.VERIFICATION_APPROVED, { verificationData }, HTTPStatus.OK);
        } catch (error) {
            next(error);
        }
    }

    // --------------------------------------------------
    //              🛠 VERIFICATION APPRVOE 
    // --------------------------------------------------

    async approveVerification(req: Request, res: Response, next: NextFunction) {
        try {
     
            const trainerId = req.params.trainerId;
            if (!trainerId) {
                throw new DataMissingExecption(Errors.INVALID_DATA);
            }
            const verificationData = await this._verificationApproveUseCase.execute(trainerId);
            ResponseHelper.success(res, MESSAGES.Trainer.VERIFICATION_REJECTED, { verificationData }, HTTPStatus.OK);
        } catch (error) {
            next(error);
        }
    }


    // --------------------------------------------------
    //              🛠 VERIFICATION REJECT WITH REASON
    // --------------------------------------------------

    async rejectVerification(req: Request, res: Response, next: NextFunction) {
        try {
            const trainerId = req.params.trainerId;
            if (!trainerId) {
                throw new DataMissingExecption(Errors.INVALID_DATA);
            }
            const reason = req.body.reason;
            if (!reason) {
                throw new DataMissingExecption(Errors.INVALID_DATA);
            }

            const verificationData = await this._verificationRejectUseCase.execute(trainerId, reason);
            ResponseHelper.success(res, MESSAGES.Trainer.VERIFICATION_DATA_SUCCESS, { verificationData }, HTTPStatus.OK);
        } catch (error) {
            next(error);
        }
    }
}
