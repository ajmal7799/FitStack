import { userAuthController } from '../../infrastructure/DI/Auth/authContainer';
import { Request, Response, Router, NextFunction } from 'express';
// import { userProfileController } from "../../infrastructure/DI/user/userContainer";
import { userSubscriptionController } from '../../infrastructure/DI/user/userSubscription/userSubscriptionContainer';
import { userTrainerController } from '../../infrastructure/DI/user/userTrainer/userTrainerContainer';
import { authMiddleware } from '../../infrastructure/DI/Auth/authContainer';
import express from 'express';

export class User_Router {
    private _route: Router;

    constructor() {
        this._route = Router();
        this._setRoute();
    }

    private _setRoute() {
        this._route.post('/signup', (req: Request, res: Response, next: NextFunction) => {
            userAuthController.signUpSendOtp(req, res, next);
        });

        this._route.post('/verify-otp',(req: Request, res: Response, next: NextFunction)=> {
            userAuthController.registerUser(req, res, next);
        });

        this._route.post('/resend-otp', (req: Request, res: Response, next: NextFunction) =>
            userAuthController.resendOtp(req, res, next),
        );

        this._route.post('/login',(req: Request, res: Response, next: NextFunction) => {
            userAuthController.loginUser(req, res, next);
        });

        this._route.post('/forgot-password',(req: Request, res: Response, next: NextFunction) => {
            userAuthController.forgetPasswordSentOtp(req, res, next);
        });

        this._route.post('/forget-password/verify-otp',(req: Request, res: Response, next: NextFunction) => {
            userAuthController.forgetPasswordVerifyOtp(req, res, next);
        });

        this._route.post('/forget-password/reset-password',(req: Request, res: Response, next: NextFunction) => {
            userAuthController.forgetPasswordResetPassword(req, res, next);
        });


        this._route.post('/google-login', (req: Request, res: Response, next: NextFunction) => {
            userAuthController.googleLogin(req, res, next);
        });

        // --------------------------------------------------
        //              🛠 HOME PAGE CONTENT
        // --------------------------------------------------


        this._route.get("/subscriptions",authMiddleware.verify, (req: Request, res: Response, next: NextFunction) => {
            userSubscriptionController.getAllSubscriptionPlans(req, res, next);
        });

        this._route.get('/get-all-trainers',authMiddleware.verify, (req: Request, res: Response, next: NextFunction) => {
            userTrainerController.getAllTrainer(req, res, next);
        });

        this._route.post("/checkout-session",authMiddleware.verify, (req: Request, res: Response, next: NextFunction) => {
            userSubscriptionController.createCheckoutSession(req, res, next);
        });

        this._route.post("/stripe/webhook", express.raw({type: 'application/json'}), (req: Request, res: Response, next: NextFunction) => {
            userSubscriptionController.handleStripeWebhook(req, res, next);
        });
        

        this._route.post('/logout',(req: Request, res: Response, next: NextFunction) => {
            userAuthController.handleLogout(req, res, next);
        });
    }

    public get routes(): Router {
        return this._route;
    }
}