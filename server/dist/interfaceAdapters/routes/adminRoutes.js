"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin_Routes = void 0;
const express_1 = require("express");
const authContainer_1 = require("../../infrastructure/DI/Auth/authContainer");
const adminUserContainer_1 = require("../../infrastructure/DI/Admin/adminUserContainer");
const adminTrainerContainer_1 = require("../../infrastructure/DI/Admin/adminTrainerContainer");
const adminVerificationContainer_1 = require("../../infrastructure/DI/Admin/adminVerificationContainer");
const adminSubscriptionContainer_1 = require("../../infrastructure/DI/Admin/subscription/adminSubscriptionContainer");
class Admin_Routes {
    constructor() {
        this._route = (0, express_1.Router)();
        this._setRoute();
    }
    _setRoute() {
        this._route.post('/login', (req, res, next) => {
            authContainer_1.adminAuthController.adminLogin(req, res, next);
        });
        this._route.get('/users', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isAdmin, (req, res, next) => {
            adminUserContainer_1.adminUserController.getAllUsers(req, res, next);
        });
        this._route.post('/users/update-status', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isAdmin, (req, res, next) => {
            adminUserContainer_1.adminUserController.updateUserStatus(req, res, next);
        });
        this._route.get('/trainers', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isAdmin, (req, res, next) => {
            adminTrainerContainer_1.adminTrainerController.getAllTrainer(req, res, next);
        });
        this._route.post('/trainers/update-status', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isAdmin, (req, res, next) => {
            adminTrainerContainer_1.adminTrainerController.updateTrainerStatus(req, res, next);
        });
        // --------------------------------------------------
        //              🛠 VERIFICATIONS 
        // --------------------------------------------------
        this._route.get('/verification', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isAdmin, (req, res, next) => {
            adminVerificationContainer_1.adminVerificationController.getAllTrainerVerificationData(req, res, next);
        });
        this._route.get('/verifications/:trainerId', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isAdmin, (req, res, next) => {
            adminVerificationContainer_1.adminVerificationController.getVerificationDetailsPage(req, res, next);
        });
        this._route.patch('/verifications/:trainerId/approve', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isAdmin, (req, res, next) => {
            adminVerificationContainer_1.adminVerificationController.approveVerification(req, res, next);
        });
        this._route.patch('/verifications/:trainerId/reject', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isAdmin, (req, res, next) => {
            adminVerificationContainer_1.adminVerificationController.rejectVerification(req, res, next);
        });
        // --------------------------------------------------
        //              🛠 SUBSCRIPTIONS
        // --------------------------------------------------
        this._route.post('/subscription', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isAdmin, (req, res, next) => {
            adminSubscriptionContainer_1.adminSubscriptionController.addSubscriptionPlan(req, res, next);
        });
        this._route.get('/subscriptions', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isAdmin, (req, res, next) => {
            adminSubscriptionContainer_1.adminSubscriptionController.getAllSubscriptionPlans(req, res, next);
        });
        this._route.patch('/subscriptions/update-status', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isAdmin, (req, res, next) => {
            adminSubscriptionContainer_1.adminSubscriptionController.updateSubscriptionStatus(req, res, next);
        });
        this._route.get('/subscriptions/:subscriptionId', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isAdmin, (req, res, next) => {
            adminSubscriptionContainer_1.adminSubscriptionController.getSubscriptionEditPage(req, res, next);
        });
        this._route.put("/subscriptions/:subscriptionId", authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isAdmin, (req, res, next) => {
            adminSubscriptionContainer_1.adminSubscriptionController.updateSubscription(req, res, next);
        });
    }
    get_router() {
        return this._route;
    }
}
exports.Admin_Routes = Admin_Routes;
