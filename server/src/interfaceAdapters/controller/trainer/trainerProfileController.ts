import { NextFunction, Request, Response } from 'express';
import { MulterFiles } from '../../../domain/types/multerFilesType';
import { multerFileToFileConverter } from '../../../shared/utils/fileConverter';
import { Errors, TRAINER_ERRORS } from '../../../shared/constants/error';
import { ResponseHelper } from '../../../shared/utils/responseHelper';
import { MESSAGES } from '../../../shared/constants/messages';
import { DataMissingExecption, InvalidDataException } from '../../../application/constants/exceptions';
import { HTTPStatus } from '../../../shared/constants/httpStatus';
import { IGetProfileData } from '../../../application/useCase/trainer/profile/IGetProfileData';
import { updateTrainerProfileSchema } from '../../../shared/validations/trainerProfileValidator';
import { IUpdateTrainerProfileUseCase } from '../../../application/useCase/trainer/profile/IUpdateProfileUseCase';

export class TrainerProfileController {
  constructor(
    private _getProfileData: IGetProfileData,
    private _updateTrainerProfileUseCase: IUpdateTrainerProfileUseCase
  ) {}

  // --------------------------------------------------
  //              🛠 GET PROFILE DATA
  // --------------------------------------------------

  async getProfilePage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const trainerId = req.user?.userId;

      if (!trainerId) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      } 

      const profileData = await this._getProfileData.getProfileData(trainerId);
      
      ResponseHelper.success(res, MESSAGES.Trainer.PROFILE_DATA_SUCCESS, { profileData }, HTTPStatus.OK);
    } catch (error) {
      next(error);
    }
  }

  async updateTrainerProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const trainerId = req.user?.userId;
      const files = req.files as MulterFiles;

      if (!trainerId) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      }
      
        if (files?.['profileImage']?.[0]) {
          req.body.profileImage = multerFileToFileConverter(files['profileImage'][0]);
        }
      

  
      const parseResult = updateTrainerProfileSchema.safeParse(req.body);

      if (parseResult.error) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const trainer = await this._updateTrainerProfileUseCase.updateTrainerProfile(trainerId, parseResult.data!);
      ResponseHelper.success(res, MESSAGES.Trainer.TRAINER_PROFILE_UPDATED, trainer, HTTPStatus.OK);
    } catch (error) {
      next(error);
    }
  }
}
