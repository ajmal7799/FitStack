"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.User_Router = void 0;
const express_1 = __importStar(require("express"));
const authContainer_1 = require("../../infrastructure/DI/Auth/authContainer");
const userSubscriptionContainer_1 = require("../../infrastructure/DI/user/userSubscription/userSubscriptionContainer");
const userTrainerContainer_1 = require("../../infrastructure/DI/user/userTrainer/userTrainerContainer");
const userProfileContainer_1 = require("../../infrastructure/DI/user/userProfileContainer");
const userAiIntegrationContainer_1 = require("../../infrastructure/DI/user/userAiIntegrationContainer");
const multer_1 = require("../middleware/multer");
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
        // --------------------------------------------------
        //              🛠 HOME PAGE CONTENT
        // --------------------------------------------------
        this._route.get('/subscriptions', authContainer_1.authMiddleware.verify, (req, res, next) => {
            userSubscriptionContainer_1.userSubscriptionController.getAllSubscriptionPlans(req, res, next);
        });
        this._route.get("/active-subscription", authContainer_1.authMiddleware.verify, (req, res, next) => {
            userSubscriptionContainer_1.userSubscriptionController.getActiveSubscription(req, res, next);
        });
        this._route.post('/checkout-session', authContainer_1.authMiddleware.verify, (req, res, next) => {
            userSubscriptionContainer_1.userSubscriptionController.createCheckoutSession(req, res, next);
        });
        this._route.post('/stripe/webhook', express_1.default.raw({ type: 'application/json' }), (req, res, next) => {
            userSubscriptionContainer_1.userSubscriptionController.handleStripeWebhook(req, res, next);
        });
        // --------------------------------------------------
        //              🛠 USER SIDE TRAINERS
        // --------------------------------------------------
        this._route.get('/get-all-trainers', authContainer_1.authMiddleware.verify, (req, res, next) => {
            userTrainerContainer_1.userTrainerController.getAllTrainer(req, res, next);
        });
        this._route.get('/get-trainer-details/:trainerId', authContainer_1.authMiddleware.verify, (req, res, next) => {
            userTrainerContainer_1.userTrainerController.getTrainerDetails(req, res, next);
        });
        this._route.post('/select-trainer', authContainer_1.authMiddleware.verify, (req, res, next) => {
            userTrainerContainer_1.userTrainerController.selectTrainer(req, res, next);
        });
        this._route.get("/get-selected-trainer", authContainer_1.authMiddleware.verify, (req, res, next) => {
            userTrainerContainer_1.userTrainerController.getSelectedTrainer(req, res, next);
        });
        // --------------------------------------------------
        //              🛠 UserProfile Routes
        // --------------------------------------------------
        this._route.post('/profile', authContainer_1.authMiddleware.verify, multer_1.upload.fields([{ name: 'profileImage', maxCount: 1 }]), (req, res, next) => {
            userProfileContainer_1.userProfileController.createUserProfile(req, res, next);
        });
        // --------------------------------------------------
        //              🛠 USER GENERATE WORKOUT PLAN  & DIEET PLAN
        // --------------------------------------------------
        this._route.post('/generate-workout-plan', authContainer_1.authMiddleware.verify, (req, res, next) => {
            userAiIntegrationContainer_1.userGenerateWorkoutplanController.handleGenerateWorkoutplan(req, res, next);
        });
        this._route.get('/get-workout-plan', authContainer_1.authMiddleware.verify, (req, res, next) => {
            userAiIntegrationContainer_1.userGenerateWorkoutplanController.getWorkoutPlan(req, res, next);
        });
        this._route.post('/generate-diet-plan', authContainer_1.authMiddleware.verify, (req, res, next) => {
            userAiIntegrationContainer_1.userGenerateDietplanController.handleDietPlan(req, res, next);
        });
        this._route.get('/get-diet-plan', authContainer_1.authMiddleware.verify, (req, res, next) => {
            userAiIntegrationContainer_1.userGenerateDietplanController.getDietPlan(req, res, next);
        });
        // --------------------------------------------------
        //              🛠 USER PROFILE DATA
        // --------------------------------------------------
        this._route.get('/profile', authContainer_1.authMiddleware.verify, (req, res, next) => {
            userProfileContainer_1.userProfileController.getUserProfile(req, res, next);
        });
        this._route.patch("/profile-update", authContainer_1.authMiddleware.verify, multer_1.upload.fields([{ name: 'profileImage', maxCount: 1 }]), (req, res, next) => {
            userProfileContainer_1.userProfileController.updateUserProfile(req, res, next);
        });
        this._route.get('/personal-info', authContainer_1.authMiddleware.verify, (req, res, next) => {
            userProfileContainer_1.userProfileController.getBodyMetrics(req, res, next);
        });
        this._route.patch('/personal-info-update', authContainer_1.authMiddleware.verify, (req, res, next) => {
            userProfileContainer_1.userProfileController.updateBodyMetrics(req, res, next);
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
