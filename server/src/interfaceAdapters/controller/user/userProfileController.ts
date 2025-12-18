import { HTTPStatus } from '../../../shared/constants/httpStatus';
import { MESSAGES } from '../../../shared/constants/messages';
import { ResponseHelper } from '../../../shared/utils/responseHelper';
import { InvalidDataException, NotFoundException } from '../../../application/constants/exceptions';
import { NextFunction, Request, Response } from 'express';
import { Errors, SUBSCRIPTION_ERRORS } from '../../../shared/constants/error';
import { MulterFiles } from '../../../domain/types/multerFilesType';
import { multerFileToFileConverter } from '../../../shared/utils/fileConverter';
import { UserProfilePayload } from '../../../domain/types/userProfilePayloadTypes';
import { userProfileSchema } from '../../../shared/validations/userProfileValidator';
import { ICreateUserProfileUseCase } from '../../../application/useCase/user/ICreateUserProfileUseCase';
import { USER_ERRORS } from '../../../shared/constants/error';
import { IGetProfileUseCase } from '../../../application/useCase/user/profile/IGetProfileUseCase';
import { IGetPersonalInfoUseCase } from '../../../application/useCase/user/profile/IGetPersonalInfoUseCase';

export class UserProfileController {
  constructor(
    private _createUserProfileUseCase: ICreateUserProfileUseCase,
    private _getProfileUseCase: IGetProfileUseCase,
    private _getPersonalInfoUseCase: IGetPersonalInfoUseCase
  ) {}

  async createUserProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const files = req.files as MulterFiles;

      const age = parseInt(req.body.age, 10);
      const height = parseFloat(req.body.height);
      const weight = parseFloat(req.body.weight);
      const targetWeight = parseFloat(req.body.targetWeight);

      const data: UserProfilePayload = {
        userId,
        age,
        gender: req.body.gender,
        height,
        weight,
        fitnessGoal: req.body.fitnessGoal,
        targetWeight,
        experienceLevel: req.body.experienceLevel,
        workoutLocation: req.body.workoutLocation,
      };

      // Optional fields
      if (req.body.dietPreference) {
        data.dietPreference = req.body.dietPreference;
      }

      if (req.body.preferredWorkoutTypes) {
        try {
          data.preferredWorkoutTypes = JSON.parse(req.body.preferredWorkoutTypes);
        } catch (e) {
          throw new InvalidDataException('Invalid workout types format');
        }
      }

      if (req.body.medicalConditions) {
        try {
          data.medicalConditions = JSON.parse(req.body.medicalConditions);
        } catch (e) {
         
          data.medicalConditions = [req.body.medicalConditions];
        }
      }

      
      if (files['profileImage']?.[0]) {
        data.profileImage = multerFileToFileConverter(files['profileImage'][0]);
      }

      
      const result = userProfileSchema.safeParse(data);

      if (!result.success) {
        throw new InvalidDataException(result.error.issues[0].message);
      }

      const userProfile = await this._createUserProfileUseCase.createUserProfile(result.data!);

      ResponseHelper.success(
        res,
        MESSAGES.USERS.PROFILE_CREATED_SUCCESSFULLY,
        { data: userProfile },
        HTTPStatus.CREATED
      );
    } catch (error) {
      next(error);
    }
  }

  async getUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        throw new NotFoundException(USER_ERRORS.NO_USERS_FOUND);
      }

      const result = await this._getProfileUseCase.execute(userId);

      ResponseHelper.success(res, MESSAGES.USERS.GET_USER_PROFILE, { result }, HTTPStatus.OK);
    } catch (error) {
      next(error);
    }
  }

  async getPersonalInfo(req: Request, res: Response, next: NextFunction) {
    try {

      const userId = (req as any).user?.userId;

      if (!userId) {
        throw new NotFoundException(USER_ERRORS.NO_USERS_FOUND);
      }

      const result = await this._getPersonalInfoUseCase.execute(userId);

      ResponseHelper.success(res, MESSAGES.USERS.GET_USER_PERSONAL_INFO, { result }, HTTPStatus.OK);
      
    } catch (error) {
      next(error);
    }
  }
}
