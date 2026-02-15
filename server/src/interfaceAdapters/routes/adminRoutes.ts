import { Router, Request, Response, NextFunction } from 'express';
import { adminAuthController, authMiddleware } from '../../infrastructure/DI/Auth/authContainer';
import { adminUserController } from '../../infrastructure/DI/Admin/adminUserContainer';
import { adminTrainerController } from '../../infrastructure/DI/Admin/adminTrainerContainer';
import { adminVerificationController } from '../../infrastructure/DI/Admin/adminVerificationContainer';
import { adminSubscriptionController } from '../../infrastructure/DI/Admin/subscription/adminSubscriptionContainer';

export class Admin_Routes {
    private _route: Router;

    constructor() {
        this._route = Router();
        this._setRoute();
    }

    private _setRoute() {


        this._route.post('/login', (req: Request, res: Response, next: NextFunction) => {
            adminAuthController.adminLogin(req, res, next);
        });

        this._route.get('/users', authMiddleware.verify, authMiddleware.isAdmin, (req: Request, res: Response, next: NextFunction) => {
            adminUserController.getAllUsers(req, res, next);
        });

        this._route.post('/users/update-status', authMiddleware.verify, authMiddleware.isAdmin, (req: Request, res: Response, next: NextFunction) => {
            adminUserController.updateUserStatus(req, res, next);
        });

        this._route.get('/trainers', authMiddleware.verify, authMiddleware.isAdmin, (req: Request, res: Response, next: NextFunction) => {
            adminTrainerController.getAllTrainer(req, res, next);
        });

        this._route.post('/trainers/update-status', authMiddleware.verify, authMiddleware.isAdmin, (req: Request, res: Response, next: NextFunction) => {
            adminTrainerController.updateTrainerStatus(req, res, next);
        });


        // --------------------------------------------------
        //              🛠 VERIFICATIONS 
        // --------------------------------------------------
        this._route.get('/verification', authMiddleware.verify, authMiddleware.isAdmin, (req: Request, res: Response, next: NextFunction) => {
            adminVerificationController.getAllTrainerVerificationData(req, res, next);
        });

        this._route.get('/verifications/:trainerId', authMiddleware.verify, authMiddleware.isAdmin, (req: Request, res: Response, next: NextFunction) => {
            adminVerificationController.getVerificationDetailsPage(req, res, next);
        });

        this._route.patch('/verifications/:trainerId/approve', authMiddleware.verify, authMiddleware.isAdmin, (req: Request, res: Response, next: NextFunction) => {
            adminVerificationController.approveVerification(req, res, next);
        });

        this._route.patch('/verifications/:trainerId/reject', authMiddleware.verify, authMiddleware.isAdmin, (req: Request, res: Response, next: NextFunction) => {
            adminVerificationController.rejectVerification(req, res, next);
        });

        // --------------------------------------------------
        //              🛠 SUBSCRIPTIONS
        // --------------------------------------------------

        this._route.post('/subscription', authMiddleware.verify, authMiddleware.isAdmin, (req: Request, res: Response, next: NextFunction) => {
            adminSubscriptionController.addSubscriptionPlan(req, res, next);
        });

        this._route.get('/subscriptions', authMiddleware.verify, authMiddleware.isAdmin, (req: Request, res: Response, next: NextFunction) => {
            adminSubscriptionController.getAllSubscriptionPlans(req, res, next);
        });

        this._route.patch('/subscriptions/update-status', authMiddleware.verify, authMiddleware.isAdmin, (req: Request, res: Response, next: NextFunction) => {
            adminSubscriptionController.updateSubscriptionStatus(req, res, next);
        });

        this._route.get('/subscriptions/:subscriptionId', authMiddleware.verify, authMiddleware.isAdmin, (req: Request, res: Response, next: NextFunction) => {
            adminSubscriptionController.getSubscriptionEditPage(req, res, next);
        });

        this._route.put('/subscriptions/:subscriptionId', authMiddleware.verify, authMiddleware.isAdmin, (req: Request, res: Response, next: NextFunction) => {
            adminSubscriptionController.updateSubscription(req, res, next);
        });
        

    }

    public get_router(): Router {
        return this._route;
    }
}