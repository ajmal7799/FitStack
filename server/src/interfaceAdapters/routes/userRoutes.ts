import express, { Router, type Request, type Response, type NextFunction } from 'express';

import { userAuthController, authMiddleware } from '../../infrastructure/DI/Auth/authContainer';

import { userSubscriptionController } from '../../infrastructure/DI/user/userSubscription/userSubscriptionContainer';
import { userTrainerController } from '../../infrastructure/DI/user/userTrainer/userTrainerContainer';
import { userProfileController } from '../../infrastructure/DI/user/userProfileContainer';
import { userBookingSlotController } from '../../infrastructure/DI/user/userBookingSlotContainer';
import { videoCallController } from '../../infrastructure/DI/videoCall/videoCallContainer';
import {
  userGenerateWorkoutplanController,
  userGenerateDietplanController,
} from '../../infrastructure/DI/user/userAiIntegrationContainer';
import { feedbackController } from '../../infrastructure/DI/Feedback/feedbackContainer';
import { upload } from '../middleware/multer';

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

    this._route.post('/verify-otp', (req: Request, res: Response, next: NextFunction) => {
      userAuthController.registerUser(req, res, next);
    });

    this._route.post('/resend-otp', (req: Request, res: Response, next: NextFunction) =>
      userAuthController.resendOtp(req, res, next)
    );

    this._route.post('/login', (req: Request, res: Response, next: NextFunction) => {
      userAuthController.loginUser(req, res, next);
    });

    this._route.post('/forgot-password', (req: Request, res: Response, next: NextFunction) => {
      userAuthController.forgetPasswordSentOtp(req, res, next);
    });

    this._route.post('/forget-password/verify-otp', (req: Request, res: Response, next: NextFunction) => {
      userAuthController.forgetPasswordVerifyOtp(req, res, next);
    });

    this._route.post('/forget-password/reset-password', (req: Request, res: Response, next: NextFunction) => {
      userAuthController.forgetPasswordResetPassword(req, res, next);
    });

    this._route.post('/google-login', (req: Request, res: Response, next: NextFunction) => {
      userAuthController.googleLogin(req, res, next);
    });

    // --------------------------------------------------
    //              🛠 HOME PAGE CONTENT
    // --------------------------------------------------

    this._route.get('/subscriptions', authMiddleware.verify, (req: Request, res: Response, next: NextFunction) => {
      userSubscriptionController.getAllSubscriptionPlans(req, res, next);
    });

    this._route.get(
      '/active-subscription',
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) => {
        userSubscriptionController.getActiveSubscription(req, res, next);
      }
    );

    this._route.post('/checkout-session', authMiddleware.verify, (req: Request, res: Response, next: NextFunction) => {
      userSubscriptionController.createCheckoutSession(req, res, next);
    });

    this._route.post(
      '/stripe/webhook',
      express.raw({ type: 'application/json' }),
      (req: Request, res: Response, next: NextFunction) => {
        userSubscriptionController.handleStripeWebhook(req, res, next);
      }
    );

    // --------------------------------------------------
    //              🛠 USER SIDE TRAINERS
    // --------------------------------------------------

    this._route.get('/get-all-trainers', authMiddleware.verify, (req: Request, res: Response, next: NextFunction) => {
      userTrainerController.getAllTrainer(req, res, next);
    });

    this._route.get(
      '/get-trainer-details/:trainerId',
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) => {
        userTrainerController.getTrainerDetails(req, res, next);
      }
    );

    this._route.post('/select-trainer', authMiddleware.verify, (req: Request, res: Response, next: NextFunction) => {
      userTrainerController.selectTrainer(req, res, next);
    });

    this._route.get(
      '/get-selected-trainer',
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) => {
        userTrainerController.getSelectedTrainer(req, res, next);
      }
    );

    // --------------------------------------------------
    //              🛠 UserProfile Routes
    // --------------------------------------------------

    this._route.post(
      '/profile',
      authMiddleware.verify,
      upload.fields([{ name: 'profileImage', maxCount: 1 }]),
      (req: Request, res: Response, next: NextFunction) => {
        userProfileController.createUserProfile(req, res, next);
      }
    );

    // --------------------------------------------------
    //              🛠 USER GENERATE WORKOUT PLAN  & DIEET PLAN
    // --------------------------------------------------

    this._route.post(
      '/generate-workout-plan',
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) => {
        userGenerateWorkoutplanController.handleGenerateWorkoutplan(req, res, next);
      }
    );

    this._route.get('/get-workout-plan', authMiddleware.verify, (req: Request, res: Response, next: NextFunction) => {
      userGenerateWorkoutplanController.getWorkoutPlan(req, res, next);
    });

    this._route.post(
      '/generate-diet-plan',
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) => {
        userGenerateDietplanController.handleDietPlan(req, res, next);
      }
    );

    this._route.get('/get-diet-plan', authMiddleware.verify, (req: Request, res: Response, next: NextFunction) => {
      userGenerateDietplanController.getDietPlan(req, res, next);
    });

    // --------------------------------------------------
    //              🛠 USER PROFILE DATA
    // --------------------------------------------------

    this._route.get('/profile', authMiddleware.verify, (req: Request, res: Response, next: NextFunction) => {
      userProfileController.getUserProfile(req, res, next);
    });

    this._route.patch(
      '/profile-update',
      authMiddleware.verify,
      upload.fields([{ name: 'profileImage', maxCount: 1 }])!,
      (req: Request, res: Response, next: NextFunction) => {
        userProfileController.updateUserProfile(req, res, next);
      }
    );

    this._route.get('/personal-info', authMiddleware.verify, (req: Request, res: Response, next: NextFunction) => {
      userProfileController.getBodyMetrics(req, res, next);
    });

    this._route.patch(
      '/personal-info-update',
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) => {
        userProfileController.updateBodyMetrics(req, res, next);
      }
    );

    this._route.patch('/change-password', authMiddleware.verify, (req: Request, res: Response, next: NextFunction) => {
      userAuthController.handlePasswordChange(req, res, next);
    });

    // --------------------------------------------------
    //              🛠 BOOKING MANAGEMENT
    // --------------------------------------------------

    this._route.get(
      '/get-available-slots',
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) => {
        userBookingSlotController.getAvailableSlots(req, res, next);
      }
    );

    this._route.patch(
      '/book-slot/:slotId',
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) => {
        userBookingSlotController.bookSlot(req, res, next);
      }
    );

    this._route.get('/booked-slots', authMiddleware.verify, (req: Request, res: Response, next: NextFunction) => {
      userBookingSlotController.getBookedSlots(req, res, next);
    });

    this._route.get(
      '/booked-slots/:slotId',
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) => {
        userBookingSlotController.getBookedSlotDetails(req, res, next);
      }
    );

    this._route.patch(  
      '/booked-slots/:slotId/cancel',
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) => {
        userBookingSlotController.cancelBookedSlot(req, res, next);
      }
    );

    this._route.get('/sessions-history', authMiddleware.verify, (req: Request, res: Response, next: NextFunction) => {  
      userBookingSlotController.getSessionHistory(req, res, next);
    });

    this._route.get('/session-history/:sessionId', authMiddleware.verify, (req: Request, res: Response, next: NextFunction) => {
      userBookingSlotController.getSessionHistoryDetails(req, res, next);
    });

    // --------------------------------------------------
    //              🛠 VIDEO CALL
    // --------------------------------------------------

    this._route.post(
      '/video-session/join/:slotId',
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) => {
        videoCallController.joinVideoSession(req, res, next);
      }
    );

    // --------------------------------------------------
    //              🛠 feedback
    // --------------------------------------------------

    this._route.post('/feedback', authMiddleware.verify, (req: Request, res: Response, next: NextFunction) => {
      feedbackController.createfeedback(req, res, next);
    });



    // --------------------------------------------------
    //              🛠 Logout
    // --------------------------------------------------

    this._route.post('/logout', (req: Request, res: Response, next: NextFunction) => {
      userAuthController.handleLogout(req, res, next);
    });
  }

  public get routes(): Router {
    return this._route;
  }
}
