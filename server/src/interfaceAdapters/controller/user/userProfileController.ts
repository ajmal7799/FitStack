import { HTTPStatus } from '../../../shared/constants/httpStatus';
import { MESSAGES } from '../../../shared/constants/messages';
import { ResponseHelper } from '../../../shared/utils/responseHelper';
import { InvalidDataException, NotFoundException } from '../../../application/constants/exceptions';
import { NextFunction, Request, Response } from 'express';
import { Errors, SUBSCRIPTION_ERRORS, USER_ERRORS } from '../../../shared/constants/error';
import { MulterFiles } from '../../../domain/types/multerFilesType';
import { multerFileToFileConverter } from '../../../shared/utils/fileConverter';
import { UserProfilePayload } from '../../../domain/types/userProfilePayloadTypes';
import { userProfileSchema,userBodyMetricsSchema } from '../../../shared/validations/userBodyMetricsValidator';
import { ICreateUserProfileUseCase } from '../../../application/useCase/user/ICreateUserProfileUseCase';
import { IGetProfileUseCase } from '../../../application/useCase/user/profile/IGetProfileUseCase';
import { IGetPersonalInfoUseCase } from '../../../application/useCase/user/profile/IGetUserBodayMetrics';
import { userPersonalInfoSchema } from '../../../shared/validations/userProfileValidator';
import { IUpdateUserProfileUseCase } from '../../../application/useCase/user/profile/IUpdateUserProfileUseCase';
import { IUpdateBodyMetricsUseCase } from '../../../application/useCase/user/profile/IUpdateBodyMetrics';
export class UserProfileController {
  constructor(
    private _createUserProfileUseCase: ICreateUserProfileUseCase,
    private _getProfileUseCase: IGetProfileUseCase,
    private _getPersonalInfoUseCase: IGetPersonalInfoUseCase,
    private _updateUserProfileUseCase: IUpdateUserProfileUseCase,
    private _updateBodyMetricsUseCase: IUpdateBodyMetricsUseCase
  ) {}

  async createUserProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      // const files = req.files as MulterFiles;

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

      // if (files['profileImage']?.[0]) {
      //   data.profileImage = multerFileToFileConverter(files['profileImage'][0]);
      // }

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
      const userId = req.user?.userId;

      if (!userId) {
        throw new NotFoundException(USER_ERRORS.NO_USERS_FOUND);
      }

      const result = await this._getProfileUseCase.execute(userId);
      
      ResponseHelper.success(res, MESSAGES.USERS.GET_USER_PROFILE, { result }, HTTPStatus.OK);
    } catch (error) {
      next(error);
    }
  }

  async updateUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      
      const userId = req.user?.userId;
      const files = req.files as MulterFiles;

      if (!userId) {
        throw new NotFoundException(USER_ERRORS.NO_USERS_FOUND);
      }

      if (files?.['profileImage']?.[0]) {
        req.body.profileImage = multerFileToFileConverter(files['profileImage'][0]);
      }

      const parseResult = userPersonalInfoSchema.safeParse(req.body);

      if (parseResult.error) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }
      const result = await this._updateUserProfileUseCase.execute(userId, parseResult.data);

      ResponseHelper.success(res, MESSAGES.USERS.USER_PROFILE_UPDATED_SUCCESSFULLY, { result }, HTTPStatus.OK);

    } catch (error) {
      next(error);
    }
  }

  async getBodyMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new NotFoundException(USER_ERRORS.NO_USERS_FOUND);
      }

      const result = await this._getPersonalInfoUseCase.execute(userId);

      ResponseHelper.success(res, MESSAGES.USERS.GET_USER_PERSONAL_INFO, { result }, HTTPStatus.OK);
    } catch (error) {
      next(error);
    }
  }

  // --------------------------------------------------
  //              🛠 UPDATE BODY METRICS
  // --------------------------------------------------

  async updateBodyMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new NotFoundException(USER_ERRORS.NO_USERS_FOUND);
      }

      const parseResult = userBodyMetricsSchema.safeParse(req.body);

      if (parseResult.error) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const result = await this._updateBodyMetricsUseCase.execute(userId, parseResult.data);

      ResponseHelper.success(res, MESSAGES.USERS.USER_PROFILE_UPDATED_SUCCESSFULLY, { result }, HTTPStatus.OK);
      
    } catch (error) {
      next(error);
    }
  }

}
