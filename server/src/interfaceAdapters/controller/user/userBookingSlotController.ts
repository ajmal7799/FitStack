import { NextFunction, Request, Response } from 'express';
import { MulterFiles } from '../../../domain/types/multerFilesType';
import { multerFileToFileConverter } from '../../../shared/utils/fileConverter';
import { Errors, TRAINER_ERRORS } from '../../../shared/constants/error';
import { ResponseHelper } from '../../../shared/utils/responseHelper';
import { MESSAGES } from '../../../shared/constants/messages';
import { DataMissingExecption, InvalidDataException } from '../../../application/constants/exceptions';
import { HTTPStatus } from '../../../shared/constants/httpStatus';
import { getAvailableSlotsSchema } from '../../../shared/validations/DateCheckerValidator';
import { IGetAllAvailableSlotUseCase } from '../../../application/useCase/user/booking/IGetAllAvailableSlotUseCase';
import { IBookSlotUseCase } from '../../../application/useCase/user/booking/IBookSlotUseCase';

export class UserBookingSlotController {
  constructor(
    private _getAllAvailableSlotUseCase: IGetAllAvailableSlotUseCase,
    private _bookSlotUseCase: IBookSlotUseCase
  ) {}

  async getAvailableSlots(req: Request, res: Response, next: NextFunction) {
    
    try {
      const userId = req.user?.userId;
      const { date } = getAvailableSlotsSchema.parse(req).query;

      if (!userId) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      }
      if (!date) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      }
      const result = await this._getAllAvailableSlotUseCase.getAvailableSlots(userId, date);
      if (!result || !result.length) {
        ResponseHelper.success(res, MESSAGES.Trainer.TRAINER_NOT_SELECTED_IN_THAT_TIME_SLOT, { result }, HTTPStatus.OK);
      }

      ResponseHelper.success(res, MESSAGES.Trainer.SLOTS_FETCHED_SUCCESS, { result }, HTTPStatus.OK);

      
    } catch (error) {
      next(error);
    }
  }

  // --------------------------------------------------
  //              🛠 BOOK SLOT
  // --------------------------------------------------

  async bookSlot(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const { slotId } = req.params;

      if (!userId) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      }
      if (!slotId) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      }
      const result = await this._bookSlotUseCase.bookSlot(userId, slotId);
      ResponseHelper.success(res, MESSAGES.USERS.SLOT_CREATED_SUCCESS, { result }, HTTPStatus.OK);
    } catch (error) {
      next(error);
    }
  }

}
