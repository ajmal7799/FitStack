"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User_Router = void 0;
const express_1 = require("express");
const authContainer_1 = require("../../infrastructure/DI/Auth/authContainer");
const userSubscriptionContainer_1 = require("../../infrastructure/DI/user/userSubscription/userSubscriptionContainer");
const userTrainerContainer_1 = require("../../infrastructure/DI/user/userTrainer/userTrainerContainer");
const userProfileContainer_1 = require("../../infrastructure/DI/user/userProfileContainer");
const userBookingSlotContainer_1 = require("../../infrastructure/DI/user/userBookingSlotContainer");
const videoCallContainer_1 = require("../../infrastructure/DI/videoCall/videoCallContainer");
const userAiIntegrationContainer_1 = require("../../infrastructure/DI/user/userAiIntegrationContainer");
const feedbackContainer_1 = require("../../infrastructure/DI/Feedback/feedbackContainer");
const multer_1 = require("../middleware/multer");
const notificationContainer_1 = require("../../infrastructure/DI/Notification/notificationContainer");
class User_Router {
    constructor() {
        this._route = (0, express_1.Router)();
        this._setRoute();
    }
    _setRoute() {
        this._route.post('/signup', (req, res, next) => {
            authContainer_1.userAuthController.signUpSendOtp(req, res, next);
        });
        this._route.post('/verify-otp', (req, res, next) => {
            authContainer_1.userAuthController.registerUser(req, res, next);
        });
        this._route.post('/resend-otp', (req, res, next) => authContainer_1.userAuthController.resendOtp(req, res, next));
        this._route.post('/login', (req, res, next) => {
            authContainer_1.userAuthController.loginUser(req, res, next);
        });
        this._route.post('/forgot-password', (req, res, next) => {
            authContainer_1.userAuthController.forgetPasswordSentOtp(req, res, next);
        });
        this._route.post('/forget-password/verify-otp', (req, res, next) => {
            authContainer_1.userAuthController.forgetPasswordVerifyOtp(req, res, next);
        });
        this._route.post('/forget-password/reset-password', (req, res, next) => {
            authContainer_1.userAuthController.forgetPasswordResetPassword(req, res, next);
        });
        this._route.post('/google-login', (req, res, next) => {
            authContainer_1.userAuthController.googleLogin(req, res, next);
        });
        this._route.post('/refresh-token', (req, res, next) => authContainer_1.userAuthController.handleRefreshToken(req, res, next));
        // --------------------------------------------------
        //              🛠 HOME PAGE CONTENT
        // --------------------------------------------------
        this._route.get('/subscriptions', (req, res, next) => {
            userSubscriptionContainer_1.userSubscriptionController.getAllSubscriptionPlans(req, res, next);
        });
        this._route.get('/active-subscription', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isUser, (req, res, next) => {
            userSubscriptionContainer_1.userSubscriptionController.getActiveSubscription(req, res, next);
        });
        this._route.post('/checkout-session', authContainer_1.authMiddleware.verify, (req, res, next) => {
            userSubscriptionContainer_1.userSubscriptionController.createCheckoutSession(req, res, next);
        });
        this._route.post('/stripe/webhook', (req, res, next) => {
            userSubscriptionContainer_1.userSubscriptionController.handleStripeWebhook(req, res, next);
        });
        // --------------------------------------------------
        //              🛠 USER SIDE TRAINERS
        // --------------------------------------------------
        this._route.get('/get-all-trainers', (req, res, next) => {
            userTrainerContainer_1.userTrainerController.getAllTrainer(req, res, next);
        });
        this._route.get('/get-trainer-details/:trainerId', (req, res, next) => {
            userTrainerContainer_1.userTrainerController.getTrainerDetails(req, res, next);
        });
        this._route.post('/select-trainer', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isUser, (req, res, next) => {
            userTrainerContainer_1.userTrainerController.selectTrainer(req, res, next);
        });
        this._route.get('/get-selected-trainer', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isUser, (req, res, next) => {
            userTrainerContainer_1.userTrainerController.getSelectedTrainer(req, res, next);
        });
        // --------------------------------------------------
        //              🛠 UserProfile Routes
        // --------------------------------------------------
        this._route.post('/profile', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isUser, multer_1.upload.fields([{ name: 'profileImage', maxCount: 1 }]), (req, res, next) => {
            userProfileContainer_1.userProfileController.createUserProfile(req, res, next);
        });
        // --------------------------------------------------
        //              🛠 USER GENERATE WORKOUT PLAN  & DIEET PLAN
        // --------------------------------------------------
        this._route.post('/generate-workout-plan', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isUser, (req, res, next) => {
            userAiIntegrationContainer_1.userGenerateWorkoutplanController.handleGenerateWorkoutplan(req, res, next);
        });
        this._route.get('/get-workout-plan', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isUser, (req, res, next) => {
            userAiIntegrationContainer_1.userGenerateWorkoutplanController.getWorkoutPlan(req, res, next);
        });
        this._route.post('/generate-diet-plan', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isUser, (req, res, next) => {
            userAiIntegrationContainer_1.userGenerateDietplanController.handleDietPlan(req, res, next);
        });
        this._route.get('/get-diet-plan', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isUser, (req, res, next) => {
            userAiIntegrationContainer_1.userGenerateDietplanController.getDietPlan(req, res, next);
        });
        // --------------------------------------------------
        //              🛠 USER PROFILE DATA
        // --------------------------------------------------
        this._route.get('/profile', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isUser, (req, res, next) => {
            userProfileContainer_1.userProfileController.getUserProfile(req, res, next);
        });
        this._route.patch('/profile-update', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isUser, multer_1.upload.fields([{ name: 'profileImage', maxCount: 1 }]), (req, res, next) => {
            userProfileContainer_1.userProfileController.updateUserProfile(req, res, next);
        });
        this._route.get('/personal-info', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isUser, (req, res, next) => {
            userProfileContainer_1.userProfileController.getBodyMetrics(req, res, next);
        });
        this._route.patch('/personal-info-update', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isUser, (req, res, next) => {
            userProfileContainer_1.userProfileController.updateBodyMetrics(req, res, next);
        });
        this._route.patch('/change-password', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isUser, (req, res, next) => {
            authContainer_1.userAuthController.handlePasswordChange(req, res, next);
        });
        // --------------------------------------------------
        //              🛠 BOOKING MANAGEMENT
        // --------------------------------------------------
        this._route.get('/get-available-slots', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isUser, (req, res, next) => {
            userBookingSlotContainer_1.userBookingSlotController.getAvailableSlots(req, res, next);
        });
        this._route.patch('/book-slot/:slotId', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isUser, (req, res, next) => {
            userBookingSlotContainer_1.userBookingSlotController.bookSlot(req, res, next);
        });
        this._route.get('/booked-slots', authContainer_1.authMiddleware.verify, (req, res, next) => {
            userBookingSlotContainer_1.userBookingSlotController.getBookedSlots(req, res, next);
        });
        this._route.get('/booked-slots/:slotId', authContainer_1.authMiddleware.verify, (req, res, next) => {
            userBookingSlotContainer_1.userBookingSlotController.getBookedSlotDetails(req, res, next);
        });
        this._route.patch('/booked-slots/:slotId/cancel', authContainer_1.authMiddleware.verify, (req, res, next) => {
            userBookingSlotContainer_1.userBookingSlotController.cancelBookedSlot(req, res, next);
        });
        this._route.get('/sessions-history', authContainer_1.authMiddleware.verify, (req, res, next) => {
            userBookingSlotContainer_1.userBookingSlotController.getSessionHistory(req, res, next);
        });
        this._route.get('/session-history/:sessionId', authContainer_1.authMiddleware.verify, (req, res, next) => {
            userBookingSlotContainer_1.userBookingSlotController.getSessionHistoryDetails(req, res, next);
        });
        // --------------------------------------------------
        //              🛠 VIDEO CALL
        // --------------------------------------------------
        this._route.post('/video-session/join/:slotId', authContainer_1.authMiddleware.verify, (req, res, next) => {
            videoCallContainer_1.videoCallController.joinVideoSession(req, res, next);
        });
        // --------------------------------------------------
        //              🛠 feedback
        // --------------------------------------------------
        this._route.post('/feedback', authContainer_1.authMiddleware.verify, (req, res, next) => {
            feedbackContainer_1.feedbackController.createfeedback(req, res, next);
        });
        // --------------------------------------------------
        //              🛠 NOTIFICATION
        // --------------------------------------------------
        this._route.get('/notifications', authContainer_1.authMiddleware.verify, (req, res, next) => {
            notificationContainer_1.notificationController.getNotifications(req, res, next);
        });
        this._route.patch('/notifications/:notificationId/read', authContainer_1.authMiddleware.verify, (req, res, next) => {
            notificationContainer_1.notificationController.markAsRead(req, res, next);
        });
        this._route.patch('/notifications/read-all', authContainer_1.authMiddleware.verify, (req, res, next) => {
            notificationContainer_1.notificationController.markAllAsRead(req, res, next);
        });
        this._route.delete('/notifications', authContainer_1.authMiddleware.verify, (req, res, next) => {
            notificationContainer_1.notificationController.clearAll(req, res, next);
        });
        // --------------------------------------------------
        //              🛠 wallet
        // --------------------------------------------------
        this._route.get('/wallet', authContainer_1.authMiddleware.verify, (req, res, next) => {
            userSubscriptionContainer_1.userSubscriptionController.getWallet(req, res, next);
        });
        // --------------------------------------------------
        //              🛠 Logout
        // --------------------------------------------------
        this._route.post('/logout', (req, res, next) => {
            authContainer_1.userAuthController.handleLogout(req, res, next);
        });
    }
    get routes() {
        return this._route;
    }
}
exports.User_Router = User_Router;
