import { NextFunction, Request, Response } from 'express';
import { MulterFiles } from '../../../domain/types/multerFilesType';
import { multerFileToFileConverter } from '../../../shared/utils/fileConverter';
import { Errors, TRAINER_ERRORS } from '../../../shared/constants/error';
import { ResponseHelper } from '../../../shared/utils/responseHelper';
import { MESSAGES } from '../../../shared/constants/messages';
import { DataMissingExecption, InvalidDataException, } from '../../../application/constants/exceptions';
import { HTTPStatus } from '../../../shared/constants/httpStatus';
import { getAvailableSlotsSchema } from '../../../shared/validations/DateCheckerValidator';
import { IGetAllAvailableSlotUseCase } from '../../../application/useCase/user/booking/IGetAllAvailableSlotUseCase';
import { IBookSlotUseCase } from '../../../application/useCase/user/booking/IBookSlotUseCase';
import { IBookedSlotUseCase } from '../../../application/useCase/user/booking/IBookedSlotUseCase';
import { IBookedSlotDetailsUseCase } from '../../../application/useCase/user/booking/IBookedSlotDetailsUseCase';
import { BookedSlotCancelUseCase } from '../../../application/implementation/user/slot/BookedSlotCancelUseCase';

export class UserBookingSlotController {
  constructor(
    private _getAllAvailableSlotUseCase: IGetAllAvailableSlotUseCase,
    private _bookSlotUseCase: IBookSlotUseCase,
    private _bookedSlotUseCase: IBookedSlotUseCase,
    private _bookedSlotDetailsUseCase: IBookedSlotDetailsUseCase,
    private _bookedSlotCancelUseCase: BookedSlotCancelUseCase,
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

  // --------------------------------------------------
  //              🛠 BOOKED SLOTS
  // --------------------------------------------------

  async getBookedSlots(req: Request, res: Response, next: NextFunction) {
    try {
        console.log("here in get booked slots controller");
      const userId = req.user?.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!userId) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      }

      const result = await this._bookedSlotUseCase.getBookedSlots(userId, page, limit);

      ResponseHelper.success(res, MESSAGES.USERS.BOOKED_SLOTS_FETCHED_SUCCESS, { result }, HTTPStatus.OK);
    } catch (error) {
      next(error);
    }
  }
   // --------------------------------------------------
   //              🛠 GET BOOKED SLOT DETAILS
   // --------------------------------------------------

  async getBookedSlotDetails(req: Request, res: Response, next: NextFunction) {
    try {
        
      const userId = req.user?.userId;
      const { slotId } = req.params;

      if (!userId) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      }
      if (!slotId) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      }

      const result = await this._bookedSlotDetailsUseCase.getBookedSlotDetails(userId, slotId);

      ResponseHelper.success(res, MESSAGES.USERS.BOOKED_SLOT_DETAILS_FETCHED_SUCCESS, { result }, HTTPStatus.OK);
    } catch (error) {
      next(error);
    }
  }

  // --------------------------------------------------
  //              🛠 CANCEL BOOKED SLOT
  // --------------------------------------------------

   async cancelBookedSlot(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.userId;
        const { slotId } = req.params;
        const reason = req.body.reason?.trim(); 

        // 1. Initial validation
        if (!userId || !slotId || !reason) {
            // Throwing a single error for missing data is fine, 
            // but ensure the spelling of Exception is correct.
            throw new DataMissingExecption(Errors.INVALID_DATA);
        }


        await this._bookedSlotCancelUseCase.cancelBookedSlot(userId, slotId, reason);


        return ResponseHelper.success(
            res, 
            MESSAGES.USERS.BOOKED_SLOT_CANCELLED_SUCCESS, 
            HTTPStatus.OK
        );
        
    } catch (error) {
        next(error);
    }
}
}
