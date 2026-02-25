import { HTTPStatus } from '../../../../shared/constants/httpStatus';
import { MESSAGES } from '../../../../shared/constants/messages';
import { ResponseHelper } from '../../../../shared/utils/responseHelper';
import {
  InvalidDataException,
  NotFoundException,
  DataMissingExecption,
} from '../../../../application/constants/exceptions';
import { NextFunction, Request, Response } from 'express';
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
} from '../../../../shared/validations/subscription/subscriptionValidator';
import { Errors, SUBSCRIPTION_ERRORS } from '../../../../shared/constants/error';
import { ICreateSubscription } from '../../../../application/useCase/admin/subscription/ICreateSubscription';
import { IGetAllSubscription } from '../../../../application/useCase/admin/subscription/IGetAllSubscription';
import { IUpdateSubscriptionStatus } from '../../../../application/useCase/admin/subscription/IUpdateSubscriptionStatus';
import { IGetSubscriptionEdit } from '../../../../application/useCase/admin/subscription/IGetSubscriptionEdit';
import { IUpdateSubscription } from '../../../../application/useCase/admin/subscription/IUpdateSubscription';
import { IGetAllMembershipsUseCase } from '../../../../application/useCase/admin/membership/IGetAllMembershipsUseCase';

export class AdminSubscriptionController {
  constructor(
    private _createSubscriptionUseCase: ICreateSubscription,
    private _getAllSubscriptionUseCase: IGetAllSubscription,
    private _updateSubscriptionStatusUseCase: IUpdateSubscriptionStatus,
    private _getSubscriptionEditPageUseCase: IGetSubscriptionEdit,
    private _updateSubscriptionUseCase: IUpdateSubscription,
    private _getAllMembershipsUseCase: IGetAllMembershipsUseCase
  ) {}

  // --------------------------------------------------
  //              🛠 CREATE SUBSCRIPTION
  // --------------------------------------------------

  async addSubscriptionPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const parseResult = createSubscriptionSchema.safeParse(req.body);

      if (parseResult.error) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const subscription = await this._createSubscriptionUseCase.createSubscription(parseResult.data!);

      ResponseHelper.success(res, MESSAGES.SUBSCRIPTION.SUBSCRIPTION_CREATE_SUCCESS, subscription, HTTPStatus.CREATED);
    } catch (error) {
      next(error);
    }
  }

  async getAllSubscriptionPlans(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("reached getAllSubscriptionPlans");
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = (req.query.status as string) || undefined;
      const search = (req.query.search as string) || undefined;

      if (page < 1 || limit < 1 || limit > 100) {
        throw new InvalidDataException(Errors.INVALID_PAGINATION_PARAMETERS);
      }

      const result = await this._getAllSubscriptionUseCase.getAllSubscription(page, limit, status, search);

      if (!result || result.subscriptions?.length === 0) {
        throw new NotFoundException(SUBSCRIPTION_ERRORS.NO_SUBSCRIPTIONS_FOUND);
      }

      ResponseHelper.success(res, MESSAGES.SUBSCRIPTION.SUBSCRIPTION_GET_SUCCESS, { data: result }, HTTPStatus.OK);
    } catch (error) {
      next(error);
    }
  }

  async updateSubscriptionStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, status } = req.body;
      if (!id || !status) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const subscription = await this._updateSubscriptionStatusUseCase.updateSubscriptionStatus(id, status);
      //   console.log('subscription', subscription);
      ResponseHelper.success(
        res,
        MESSAGES.SUBSCRIPTION.SUBSCRIPTION_UPDATE_STATUS_SUCCESS,
        subscription,
        HTTPStatus.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async getSubscriptionEditPage(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriptionId } = req.params;

      if (!subscriptionId) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      }

      const subscription = await this._getSubscriptionEditPageUseCase.getSubscriptionEditPage(subscriptionId);

      ResponseHelper.success(res, MESSAGES.SUBSCRIPTION.SUBSCRIPTION_EDIT_PAGE_SUCCESS, subscription, HTTPStatus.OK);
    } catch (error) {
      next(error);
    }
  }

  async updateSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriptionId } = req.params;

      if (!subscriptionId) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      }

      const parseResult = updateSubscriptionSchema.safeParse(req.body!);

      if (parseResult.error) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const subscription = await this._updateSubscriptionUseCase.updateSubscription(subscriptionId, parseResult.data);
      ResponseHelper.success(res, MESSAGES.SUBSCRIPTION.SUBSCRIPTION_UPDATE_SUCCESS, subscription, HTTPStatus.OK);
    } catch (error) {
      next(error);
    }
  }

  async getAllMemberships(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = (req.query.status as string) || undefined;
      const search = (req.query.search as string) || undefined;

      if (page < 1 || limit < 1 || limit > 100) {
        throw new InvalidDataException(Errors.INVALID_PAGINATION_PARAMETERS);
      }

      const result = await this._getAllMembershipsUseCase.execute(page, limit, status, search);
      ResponseHelper.success(res, MESSAGES.SUBSCRIPTION.MEMBERSHIP_SUCCESS, { result }, HTTPStatus.OK);
    } catch (error) {
      next(error);
    }
  }
}
