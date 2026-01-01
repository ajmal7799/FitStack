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
exports.TrainerProfileController = void 0;
const fileConverter_1 = require("../../../shared/utils/fileConverter");
const error_1 = require("../../../shared/constants/error");
const responseHelper_1 = require("../../../shared/utils/responseHelper");
const messages_1 = require("../../../shared/constants/messages");
const exceptions_1 = require("../../../application/constants/exceptions");
const trainerProfileValidator_1 = require("../../../shared/validations/trainerProfileValidator");
class TrainerProfileController {
    constructor(_getProfileData, _updateTrainerProfileUseCase) {
        this._getProfileData = _getProfileData;
        this._updateTrainerProfileUseCase = _updateTrainerProfileUseCase;
    }
    // --------------------------------------------------
    //              🛠 GET PROFILE DATA
    // --------------------------------------------------
    getProfilePage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const trainerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!trainerId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                const profileData = yield this._getProfileData.getProfileData(trainerId);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.Trainer.PROFILE_DATA_SUCCESS, { profileData }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateTrainerProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const trainerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const files = req.files;
                if (!trainerId) {
                    throw new exceptions_1.DataMissingExecption(error_1.Errors.INVALID_DATA);
                }
                if ((_b = files === null || files === void 0 ? void 0 : files['profileImage']) === null || _b === void 0 ? void 0 : _b[0]) {
                    req.body.profileImage = (0, fileConverter_1.multerFileToFileConverter)(files['profileImage'][0]);
                }
                const parseResult = trainerProfileValidator_1.updateTrainerProfileSchema.safeParse(req.body);
                if (parseResult.error) {
                    throw new exceptions_1.InvalidDataException(error_1.Errors.INVALID_DATA);
                }
                const trainer = yield this._updateTrainerProfileUseCase.updateTrainerProfile(trainerId, parseResult.data);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.Trainer.TRAINER_PROFILE_UPDATED, trainer, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.TrainerProfileController = TrainerProfileController;
