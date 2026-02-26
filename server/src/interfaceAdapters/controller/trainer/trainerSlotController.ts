import { NextFunction, Request, Response } from 'express';
import { MulterFiles } from '../../../domain/types/multerFilesType';
import { multerFileToFileConverter } from '../../../shared/utils/fileConverter';
import { Errors, TRAINER_ERRORS } from '../../../shared/constants/error';
import { ResponseHelper } from '../../../shared/utils/responseHelper';
import { MESSAGES } from '../../../shared/constants/messages';
import { DataMissingExecption, InvalidDataException } from '../../../application/constants/exceptions';
import { HTTPStatus } from '../../../shared/constants/httpStatus';
import { slotCreationSchema } from '../../../shared/validations/slotCreationValidator';
import { ICreateSlotUseCase } from '../../../application/useCase/trainer/slot/ICreateSlotUseCase';
import { IGetAllSlotsUseCase } from '../../../application/useCase/trainer/slot/IGetAllSlotsUseCase';
import { NotFoundException } from '../../../application/constants/exceptions';
import { IDeleteSlotUseCase } from '../../../application/useCase/trainer/slot/IDeleteSlotUseCase';
import { recurringSlotSchema } from '../../../shared/validations/recurringSlotValidatior';
import { IRecurringSlotUseCase } from '../../../application/useCase/trainer/slot/IRecurringSlotUseCase';
import { IBookedSlotsUseCase } from '../../../application/useCase/trainer/slot/IBookedSlotsUseCase';
import { IBookedSlotDetailsUseCase } from '../../../application/useCase/trainer/slot/IBookedSlotDetailsUseCase';
import { ISessionHistoryUseCase } from '../../../application/useCase/trainer/slot/ISessionHistoryUseCase';
import { ISessionHistoryDetailsUseCase } from '../../../application/useCase/trainer/slot/ISessionHistoryDetails';
export class TrainerSlotController {
  constructor(
    private _createSlotUseCase: ICreateSlotUseCase,
    private _getAllSlotsUseCase: IGetAllSlotsUseCase,
    private _deleteSlotUseCase: IDeleteSlotUseCase,
    private _recurringSlotUseCase: IRecurringSlotUseCase,
    private _bookedSlotsUseCase: IBookedSlotsUseCase,
    private _bookedSlotDetailsUseCase: IBookedSlotDetailsUseCase,
    private _sessionHistoryUseCase: ISessionHistoryUseCase,
    private _sessionHistoryDetailsUseCase: ISessionHistoryDetailsUseCase,

  ) {}
  // --------------------------------------------------
  //              🛠 CREATE SLOTS
  // --------------------------------------------------

  async createSlot(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user?.userId;
      console.log(user);
      if (!user) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      }

      const parseResult = slotCreationSchema.safeParse(req.body);

      if (parseResult.error) {
        throw new InvalidDataException(parseResult.error.message);
      }
      const result = await this._createSlotUseCase.createSlot(user, parseResult.data.startTime);

      ResponseHelper.success(res, MESSAGES.Trainer.SLOT_CREATED_SUCCESS, { result }, HTTPStatus.CREATED);
    } catch (error) {
      next(error);
    }
  }

  // --------------------------------------------------
  //              🛠 GET ALL SLOTS
  // --------------------------------------------------

  async getAllSlots(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const trainerId = req.user?.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const status = (req.query.status as string) || undefined;

      if (!trainerId) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      }

      if (page < 1 || limit < 1 || limit > 100) {
        throw new InvalidDataException(Errors.INVALID_PAGINATION_PARAMETERS);
      }

      const result = await this._getAllSlotsUseCase.getAllSlots(trainerId, page, limit, status);

      if (!result || !result.slots || result.slots.length === 0) {
        ResponseHelper.success(res, MESSAGES.Trainer.SLOTS_FETCHED_SUCCESS, { result }, HTTPStatus.OK);
      }

      ResponseHelper.success(res, MESSAGES.Trainer.SLOTS_FETCHED_SUCCESS, { result }, HTTPStatus.OK);
    } catch (error) {
      next(error);
    }
  }
  // --------------------------------------------------
  //              🛠 DELETE SLOT
  // --------------------------------------------------

  async deleteSlot(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const trainerId = req.user?.userId;
      const { slotId } = req.params;
      if (!trainerId) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      }
      if (!slotId) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      }

      await this._deleteSlotUseCase.deleteSlot(slotId, trainerId);
      ResponseHelper.success(res, MESSAGES.Trainer.SLOT_DELETED_SUCCESS, HTTPStatus.OK);
    } catch (error) {
      next(error);
    }
  }

  // --------------------------------------------------
  //              🛠 RECURRING SLOT CREATION
  // --------------------------------------------------

  async createRecurringSlot(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const trainerId = req.user?.userId;

      if (!trainerId) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      }

      const parseResult = recurringSlotSchema.safeParse(req.body);

      if (parseResult.error) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const result = await this._recurringSlotUseCase.createRecurringSlot(trainerId, parseResult.data);
      ResponseHelper.success(res, MESSAGES.Trainer.SLOT_CREATED_SUCCESS, { result }, HTTPStatus.CREATED);
    } catch (error) {
      next(error);
    }
  }

  async getBookedSlots(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const trainerId = req.user?.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = (req.query.status as string) || undefined;
      if (!trainerId) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      }
      const result = await this._bookedSlotsUseCase.getBookedSlots(trainerId, page, limit, status);
      ResponseHelper.success(res, MESSAGES.Trainer.BOOKED_SLOTS_FETCHED_SUCCESS, { result }, HTTPStatus.OK);
    } catch (error) {
      next(error);
    }
  }

  async getBookedSlotDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const trainerId = req.user?.userId;
      const { slotId } = req.params;

      if (!trainerId  || !slotId) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      } 
      
      const result = await this._bookedSlotDetailsUseCase.getBookedSlotDetails(trainerId, slotId);
      ResponseHelper.success(res, MESSAGES.Trainer.BOOKED_SLOT_DETAILS_FETCHED_SUCCESS, { result }, HTTPStatus.OK);
    } catch (error) {
      next(error);
    }
  }

  // --------------------------------------------------
  //              🛠 SESSION HISTORY 
  // --------------------------------------------------

  async getSessionHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const trainerId = req.user?.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!trainerId) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      }
      const result = await this._sessionHistoryUseCase.getTrainerSessionHistory(trainerId, page, limit,);
      ResponseHelper.success(res, MESSAGES.Trainer.SESSION_HISTORY_FETCHED_SUCCESS, { result }, HTTPStatus.OK);
    } catch (error) {
      next(error);
    }
  }

  // --------------------------------------------------
  //              🛠 SESSION HISTORY DETAILS
  // --------------------------------------------------

  async getSessionHistoryDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const trainerId = req.user?.userId;
      const { sessionId } = req.params;

      if (!trainerId || !sessionId) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      }

      const result = await this._sessionHistoryDetailsUseCase.getTrainerSessionHistoryDetails(trainerId, sessionId);
      ResponseHelper.success(res, MESSAGES.Trainer.SESSION_HISTORY_DETAILS_FETCHED_SUCCESS, { result }, HTTPStatus.OK);
    } catch (error) {
      next(error);
    }
  }

}
