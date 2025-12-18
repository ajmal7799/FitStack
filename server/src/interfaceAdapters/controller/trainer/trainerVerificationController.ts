import { NextFunction, Request, Response } from 'express';
import { MulterFiles } from '../../../domain/types/multerFilesType';
import { multerFileToFileConverter } from '../../../shared/utils/fileConverter';
import { Errors, TRAINER_ERRORS } from '../../../shared/constants/error';
import { ResponseHelper } from '../../../shared/utils/responseHelper';

import { trainerVerificationSchema } from '../../../shared/validations/trainerVerificationValidator';
import { DataMissingExecption, InvalidDataException } from '../../../application/constants/exceptions';
import { IUpdateTrainers } from '../../../application/useCase/trainer/IUpdateTrainers';
import { MESSAGES } from '../../../shared/constants/messages';
import { ca, da } from 'zod/locales';
import { HTTPStatus } from '../../../shared/constants/httpStatus';
import { IGetProfileData } from '../../../application/useCase/trainer/IGetProfileData';
import { IGetVerificationData } from '../../../application/useCase/trainer/IGetVerificationData';
import { SubmitTrainerVerificationRequest } from '../../../application/dto/trainer/trainerDTO';


export class TrainerVerificationController {
  constructor(
    private _updateTrainerUseCase: IUpdateTrainers,
    private _getProfileData: IGetProfileData,
    private _verificationData: IGetVerificationData
  ) {}

  // --------------------------------------------------
  //              🛠 TRANIER VERIFICATION
  // --------------------------------------------------
  async verifyTrainer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const trainerId = (req as any).user?.userId;
      
      const files = req.files as MulterFiles;

      const { qualification, specialisation, experience, about } = req.body;  

      const data: any = {
        trainerId,
        qualification,
        specialisation,
        experience,
        about,
      };
      
      if (files['idCard']?.[0]) {
        data.idCard = multerFileToFileConverter(files['idCard'][0]); // array
      }

      if (files['educationCert']?.[0]) {
        data.educationCert = multerFileToFileConverter(files['educationCert'][0]);
      }

      if (files['experienceCert']?.[0]) {
        data.experienceCert = multerFileToFileConverter(files['experienceCert'][0]);
      }

      const result = trainerVerificationSchema.safeParse(data);

      if (!result.success) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }
      const verifiedTrainer = await this._updateTrainerUseCase.updateTrainerProfile(result.data!);
      if (!verifiedTrainer) {
        throw new InvalidDataException(TRAINER_ERRORS.TRAINER_VERIFICATION_FAILED);
      }

      ResponseHelper.success(res, MESSAGES.Trainer.VERIFICATION_SUBMITTED, { data: verifiedTrainer }, HTTPStatus.CREATED);
      
    } catch (error) {
      next(error);
    }
  }

  // --------------------------------------------------
  //              🛠 GET PROFILE DATA
  // --------------------------------------------------

  async getProfilePage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      
      const trainerId = (req as any).user?.userId;
      
      if (!trainerId) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      }

      const profileData = await this._getProfileData.getProfileData(trainerId);
      ResponseHelper.success(res, MESSAGES.Trainer.PROFILE_DATA_SUCCESS, { profileData }, HTTPStatus.OK);
    } catch (error) {
      next(error);
    }
  }

  // --------------------------------------------------
  //              🛠 GET VERIFICATION PAGE
  // --------------------------------------------------

  async getVerificationPage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      
      const trainerId = (req as any).user?.userId;
      if (!trainerId) {
        throw new DataMissingExecption(Errors.INVALID_DATA); 
      }
      const verificationData = await this._verificationData.getVerificationData(trainerId);
      // console.log("verificationDatas", verificationData);
    
      ResponseHelper.success(res, MESSAGES.Trainer.VERIFICATION_DATA_SUCCESS, {verificationData }, HTTPStatus.OK);
    } catch (error) {
      next(error); 
    }
  }
}
