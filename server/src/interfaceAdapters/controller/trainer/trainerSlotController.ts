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

export class TrainerSlotController {
  constructor(
    private _createSlotUseCase: ICreateSlotUseCase,
    private _getAllSlotsUseCase: IGetAllSlotsUseCase,
    private _deleteSlotUseCase: IDeleteSlotUseCase
  ) {}
  // --------------------------------------------------
  //              🛠 CREATE SLOTS
  // --------------------------------------------------

  async createSlot(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      
      const user = req.user?.userId;

      if (!user) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      }
      
      const parseResult = slotCreationSchema.safeParse(req.body);

      if (parseResult.error) {
        throw new InvalidDataException(Errors.INVALID_DATA);
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

      if (!result || !result.slots || result.slots.length === 0 ) {
        ResponseHelper.success(res, MESSAGES.Trainer.SLOTS_FETCHED_SUCCESS, { result }, HTTPStatus.OK);
      }


      ResponseHelper.success(res, MESSAGES.Trainer.SLOTS_FETCHED_SUCCESS, { result }, HTTPStatus.OK);

    } catch (error) {
      next(error);
    }
  }
  // --------------------------------------------------
  //              🛠 DELETE SLOT
  // --------------------------------------------------\

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
}
