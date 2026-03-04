"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trainer_Routes = void 0;
const express_1 = require("express");
const trainerVerificationContainer_1 = require("../../infrastructure/DI/Trainer/trainerVerificationContainer");
const trainerProfileContainer_1 = require("../../infrastructure/DI/Trainer/trainerProfileContainer");
const authContainer_1 = require("../../infrastructure/DI/Auth/authContainer");
const trainerSlotContainer_1 = require("../../infrastructure/DI/Trainer/trainerSlotContainer");
const multer_1 = require("../middleware/multer");
const trainerDashboardContainer_1 = require("../../infrastructure/DI/Trainer/trainerDashboardContainer");
class Trainer_Routes {
    constructor() {
        this._route = (0, express_1.Router)();
        this._setRoute();
    }
    _setRoute() {
        this._route.post('/verification', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isTrainer, multer_1.upload.fields([
            { name: 'idCard', maxCount: 1 },
            { name: 'educationCert', maxCount: 1 },
            { name: 'experienceCert', maxCount: 1 },
        ]), (req, res, next) => {
            trainerVerificationContainer_1.trainerVerificationController.verifyTrainer(req, res, next);
        });
        this._route.get('/profile', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isTrainer, (req, res, next) => {
            trainerProfileContainer_1.trainerProfileController.getProfilePage(req, res, next);
        });
        this._route.patch('/profile-update', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isTrainer, multer_1.upload.fields([{ name: 'profileImage', maxCount: 1 }]), (req, res, next) => {
            trainerProfileContainer_1.trainerProfileController.updateTrainerProfile(req, res, next);
        });
        this._route.get('/get-verification', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isTrainer, (req, res, next) => {
            trainerVerificationContainer_1.trainerVerificationController.getVerificationPage(req, res, next);
        });
        // --------------------------------------------------
        //              🛠 SLOT
        // --------------------------------------------------
        this._route.post('/slots', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isTrainer, (req, res, next) => {
            trainerSlotContainer_1.trainerSlotController.createSlot(req, res, next);
        });
        this._route.post('/recurring-slots', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isTrainer, (req, res, next) => {
            trainerSlotContainer_1.trainerSlotController.createRecurringSlot(req, res, next);
        });
        this._route.get('/get-slots', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isTrainer, (req, res, next) => {
            trainerSlotContainer_1.trainerSlotController.getAllSlots(req, res, next);
        });
        this._route.delete('/slots/:slotId', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isTrainer, (req, res, next) => {
            trainerSlotContainer_1.trainerSlotController.deleteSlot(req, res, next);
        });
        this._route.get('/booked-slots', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isTrainer, (req, res, next) => {
            trainerSlotContainer_1.trainerSlotController.getBookedSlots(req, res, next);
        });
        this._route.get('/booked-slots/:slotId', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isTrainer, (req, res, next) => {
            trainerSlotContainer_1.trainerSlotController.getBookedSlotDetails(req, res, next);
        });
        this._route.get('/sessions-history', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isTrainer, (req, res, next) => {
            trainerSlotContainer_1.trainerSlotController.getSessionHistory(req, res, next);
        });
        this._route.get('/session-history/:sessionId', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isTrainer, (req, res, next) => {
            trainerSlotContainer_1.trainerSlotController.getSessionHistoryDetails(req, res, next);
        });
        // --------------------------------------------------
        //              🛠 DASHBOARD
        // --------------------------------------------------
        this._route.get('/dashboard/stats', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isTrainer, (req, res, next) => trainerDashboardContainer_1.trainerDashboardController.getStats(req, res, next));
        this._route.get('/dashboard/charts', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isTrainer, (req, res, next) => trainerDashboardContainer_1.trainerDashboardController.getChartData(req, res, next));
    }
    get_router() {
        return this._route;
    }
}
exports.Trainer_Routes = Trainer_Routes;
