"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trainer_Routes = void 0;
const express_1 = require("express");
const trainerVerificationContainer_1 = require("../../infrastructure/DI/Trainer/trainerVerificationContainer");
const trainerProfileContainer_1 = require("../../infrastructure/DI/Trainer/trainerProfileContainer");
const authContainer_1 = require("../../infrastructure/DI/Auth/authContainer");
const multer_1 = require("../middleware/multer");
class Trainer_Routes {
    constructor() {
        this._route = (0, express_1.Router)();
        this._setRoute();
    }
    _setRoute() {
        this._route.post('/verification', authContainer_1.authMiddleware.verify, multer_1.upload.fields([
            { name: 'idCard', maxCount: 1 },
            { name: 'educationCert', maxCount: 1 },
            { name: 'experienceCert', maxCount: 1 },
        ]), (req, res, next) => {
            trainerVerificationContainer_1.trainerVerificationController.verifyTrainer(req, res, next);
        });
        this._route.get('/profile', authContainer_1.authMiddleware.verify, (req, res, next) => {
            trainerProfileContainer_1.trainerProfileController.getProfilePage(req, res, next);
        });
        this._route.patch("/profile-update", authContainer_1.authMiddleware.verify, multer_1.upload.fields([{ name: 'profileImage', maxCount: 1 }]), (req, res, next) => {
            trainerProfileContainer_1.trainerProfileController.updateTrainerProfile(req, res, next);
        });
        this._route.get('/get-verification', authContainer_1.authMiddleware.verify, (req, res, next) => {
            trainerVerificationContainer_1.trainerVerificationController.getVerificationPage(req, res, next);
        });
    }
    get_router() {
        return this._route;
    }
}
exports.Trainer_Routes = Trainer_Routes;
