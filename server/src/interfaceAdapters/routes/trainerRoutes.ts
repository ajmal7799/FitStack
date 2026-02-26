import { Router, Request, Response, NextFunction } from 'express';
import { trainerVerificationController } from '../../infrastructure/DI/Trainer/trainerVerificationContainer';
import { trainerProfileController } from '../../infrastructure/DI/Trainer/trainerProfileContainer';
import { authMiddleware } from '../../infrastructure/DI/Auth/authContainer';
import { trainerSlotController } from '../../infrastructure/DI/Trainer/trainerSlotContainer';
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
            trainerProfileController.getProfilePage(req, res, next);
        });

        this._route.patch('/profile-update',authMiddleware.verify,upload.fields([{ name:'profileImage',maxCount:1 }])!,(req: Request, res: Response, next: NextFunction) => {
            trainerProfileController.updateTrainerProfile(req, res, next);
        });

        this._route.get('/get-verification',authMiddleware.verify,(req: Request, res: Response, next: NextFunction) => {
            trainerVerificationController.getVerificationPage(req, res, next);
        });

        // --------------------------------------------------
        //              🛠 SLOT 
        // --------------------------------------------------

        this._route.post('/slots',authMiddleware.verify,(req: Request, res: Response, next: NextFunction) => {
            trainerSlotController.createSlot(req, res, next);
        });

        this._route.post('/recurring-slots',authMiddleware.verify,(req: Request, res: Response, next: NextFunction) => {
            trainerSlotController.createRecurringSlot(req, res, next);
        });

        this._route.get('/get-slots',authMiddleware.verify,(req: Request, res: Response, next: NextFunction) => {
            trainerSlotController.getAllSlots(req, res, next);
        });

        this._route.delete('/slots/:slotId',authMiddleware.verify,(req: Request, res: Response, next: NextFunction) => {
            trainerSlotController.deleteSlot(req, res, next);
        });

        this._route.get('/booked-slots',authMiddleware.verify,(req: Request, res: Response, next: NextFunction) => {
            trainerSlotController.getBookedSlots(req, res, next);
        });

        this._route.get('/booked-slots/:slotId',authMiddleware.verify,(req: Request, res: Response, next: NextFunction) => {    
            trainerSlotController.getBookedSlotDetails(req, res, next);
        });

        this._route.get('/sessions-history',authMiddleware.verify,(req: Request, res: Response, next: NextFunction) => {
            trainerSlotController.getSessionHistory(req, res, next);
        });

        this._route.get('/session-history/:sessionId',authMiddleware.verify,(req: Request, res: Response, next: NextFunction) => {
            trainerSlotController.getSessionHistoryDetails(req, res, next);
        });


     

     

            

    }

    public get_router(): Router {
        return this._route;
    }
}
