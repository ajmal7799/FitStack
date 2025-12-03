import { Router, Request, Response, NextFunction } from 'express';
import { trainerVerificationController } from '../../infrastructure/DI/Trainer/trainerVerificationContainer';
import { authMiddleware } from '../../infrastructure/DI/Auth/authContainer';
import { upload } from '../middleware/multer';

export class Trainer_Routes {
    private _route: Router;

    constructor() {
        this._route = Router();
        this._setRoute();
    }

    private _setRoute() {
        this._route.post(
            '/verification',
            authMiddleware.verify,
            upload.fields([
                { name: 'idCard', maxCount: 1 },
                { name: 'educationCert', maxCount: 1 },
                { name: 'experienceCert', maxCount: 1 },
            ]),  
            (req: Request, res: Response, next: NextFunction) => {
                trainerVerificationController.verifyTrainer(req, res, next); 
            },
        );

        this._route.get('/profile',authMiddleware.verify,(req: Request, res: Response, next: NextFunction) => {
            trainerVerificationController.getProfilePage(req, res, next);
        });

        this._route.get('/get-verification',authMiddleware.verify,(req: Request, res: Response, next: NextFunction) => {
            trainerVerificationController.getVerificationPage(req, res, next);
        })

    }

    public get_router(): Router {
        return this._route;
    }
}
