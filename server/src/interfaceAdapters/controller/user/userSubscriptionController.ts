import { HTTPStatus } from '../../../shared/constants/httpStatus';
import { MESSAGES } from '../../../shared/constants/messages';
import { ResponseHelper } from '../../../shared/utils/responseHelper';
import { InvalidDataException, NotFoundException } from '../../../application/constants/exceptions';
import { NextFunction, Request, Response } from 'express';
import { Errors, SUBSCRIPTION_ERRORS,USER_ERRORS } from '../../../shared/constants/error';
import { IGetAllSubscriptionUser } from '../../../application/useCase/user/subscription/IGetAllSubscription';
import { ICreateUserCheckoutSession } from '../../../application/useCase/user/subscription/ICreateUserCheckoutSession';
import { IHandleWebhookUseCase } from '../../../application/useCase/user/subscription/IHandleWebhookUseCase';
import { IActiveSubscriptionUseCase } from '../../../application/useCase/user/subscription/IActiveSubscriptionUseCase';
import { IGetWalletUseCase } from '../../../application/useCase/wallet/IGetWalletUseCase';

export class UserSubscriptionController {
    constructor(
    private _getAllSubscriptionUseCase: IGetAllSubscriptionUser,
    private _createCheckoutSessionUseCase: ICreateUserCheckoutSession,
    private _handleWebhookUseCase: IHandleWebhookUseCase,
    private _activeSubscriptionUseCase: IActiveSubscriptionUseCase,
    private _getWalletUseCase: IGetWalletUseCase,
    ) {}

    // --------------------------------------------------
    //              🛠 SHOW ALL SUBSCRIPTION PLAN
    // --------------------------------------------------

    async getAllSubscriptionPlans(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            if (page < 1 || limit < 1 || limit > 100) {
                throw new InvalidDataException(Errors.INVALID_PAGINATION_PARAMETERS);
            }

            const result = await this._getAllSubscriptionUseCase.getAllSubscription(page, limit);

            if (!result || result.subscriptions?.length === 0) {
                throw new NotFoundException(SUBSCRIPTION_ERRORS.NO_SUBSCRIPTIONS_FOUND);
            }
            // console.log("result", result);
            ResponseHelper.success(res, MESSAGES.SUBSCRIPTION.SUBSCRIPTION_GET_SUCCESS, { data: result }, HTTPStatus.OK);
        } catch (error) {
            next(error);
        }
    }

    // --------------------------------------------------
    //              🛠 CHECKOUT SESSION "PAYMENT"
    // --------------------------------------------------

    async createCheckoutSession(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;

            const { planId } = req.body;

            if (!planId || !userId) {
                throw new InvalidDataException(Errors.INTERNAL_SERVER_ERROR);
            }

            const result = await this._createCheckoutSessionUseCase.execute(planId, userId);

            ResponseHelper.success(res, MESSAGES.SUBSCRIPTION.SUBSCRIPTION_GET_SUCCESS, { data: result }, HTTPStatus.OK);
        } catch (error) {
            next(error);
        }
    }

    // --------------------------------------------------
    //              🛠 HANDLE STRIPE WEBHOOK
    // --------------------------------------------------

    async handleStripeWebhook(req: Request, res: Response, next: NextFunction) {
        const signature = req.headers['stripe-signature'] as string;
        console.log('Body is Buffer:', Buffer.isBuffer(req.body)); // must print TRUE
        console.log('Signature:', signature);
        res.status(200).json({ received: true });
        try {

            await this._handleWebhookUseCase.excute(req.body, signature);
        } catch (error) {
            console.error('❌ Webhook error:', error);
                
        }
    }

    // --------------------------------------------------
    //              🛠 SHOW ACTIVE SUBSCRIPTION
    // --------------------------------------------------

    async getActiveSubscription(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new NotFoundException(USER_ERRORS.NO_USERS_FOUND);
            }
            const result = await this._activeSubscriptionUseCase.showActiveSubscription(userId!);
            ResponseHelper.success(res, MESSAGES.SUBSCRIPTION.SUBSCRIPTION_GET_SUCCESS, { result }, HTTPStatus.OK);
        } catch (error) {
            next(error);
        }
    }

    // --------------------------------------------------
    //              🛠 GET WALLET
    // --------------------------------------------------

    async getWallet(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;
            const role = req.user?.role;
            if (!userId) {
                throw new NotFoundException(USER_ERRORS.NO_USERS_FOUND);
            }
            const result = await this._getWalletUseCase.execute(userId!, role!);
            ResponseHelper.success(res, MESSAGES.SUBSCRIPTION.WALLET_FETCHED_SUCCESS,  result , HTTPStatus.OK);
        } catch (error) {
            next(error);
        }
    }


   

 
}
