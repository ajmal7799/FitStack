"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerVerificationController = void 0;
const fileConverter_1 = require("../../../shared/utils/fileConverter");
const error_1 = require("../../../shared/constants/error");
const responseHelper_1 = require("../../../shared/utils/responseHelper");
const trainerVerificationValidator_1 = require("../../../shared/validations/trainerVerificationValidator");
const exceptions_1 = require("../../../application/constants/exceptions");
const messages_1 = require("../../../shared/constants/messages");
class TrainerVerificationController {
    constructor(_updateTrainerUseCase, _verificationData) {
        this._updateTrainerUseCase = _updateTrainerUseCase;
        this._verificationData = _verificationData;
    }
    // --------------------------------------------------
    //              🛠 TRANIER VERIFICATION
    // --------------------------------------------------
    verifyTrainer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const trainerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const files = req.files;
                const { qualification, specialisation, experience, about } = req.body;
                const data = {
                    trainerId,
                    qualification,
                    specialisation,
                    experience,
                    about,
                };
                if ((_b = files['idCard']) === null || _b === void 0 ? void 0 : _b[0]) {
                    data.idCard = (0, fileConverter_1.multerFileToFileConverter)(files['idCard'][0]); // array
                }
                if ((_c = files['educationCert']) === null || _c === void 0 ? void 0 : _c[0]) {
                    data.educationCert = (0, fileConverter_1.multerFileToFileConverter)(files['educationCert'][0]);
                }
                if ((_d = files['experienceCert']) === null || _d === void 0 ? void 0 : _d[0]) {
                    data.experienceCert = (0, fileConverter_1.multerFileToFileConverter)(files['experienceCert'][0]);
                }
                const result = trainerVerificationValidator_1.trainerVerificationSchema.safeParse(data);
                if (!result.success) {
                    throw new exceptions_1.InvalidDataException(error_1.Errors.INVALID_DATA);
                }
                const verifiedTrainer = yield this._updateTrainerUseCase.updateTrainerProfile(result.data);
                if (!verifiedTrainer) {
                    throw new exceptions_1.InvalidDataException(error_1.TRAINER_ERRORS.TRAINER_VERIFICATION_FAILED);
                }
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.Trainer.VERIFICATION_SUBMITTED, { data: verifiedTrainer }, 201 /* HTTPStatus.CREATED */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // --------------------------------------------------
    //              🛠 GET VERIFICATION PAGE
    // --------------------------------------------------
    getVerificationPage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const trainerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!trainerId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                const verificationData = yield this._verificationData.getVerificationData(trainerId);
                // console.log("verificationDatas", verificationData);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.Trainer.VERIFICATION_DATA_SUCCESS, { verificationData }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.TrainerVerificationController = TrainerVerificationController;
