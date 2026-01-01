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
exports.UserProfileController = void 0;
const messages_1 = require("../../../shared/constants/messages");
const responseHelper_1 = require("../../../shared/utils/responseHelper");
const exceptions_1 = require("../../../application/constants/exceptions");
const error_1 = require("../../../shared/constants/error");
const fileConverter_1 = require("../../../shared/utils/fileConverter");
const userBodyMetricsValidator_1 = require("../../../shared/validations/userBodyMetricsValidator");
const userProfileValidator_1 = require("../../../shared/validations/userProfileValidator");
class UserProfileController {
    constructor(_createUserProfileUseCase, _getProfileUseCase, _getPersonalInfoUseCase, _updateUserProfileUseCase, _updateBodyMetricsUseCase) {
        this._createUserProfileUseCase = _createUserProfileUseCase;
        this._getProfileUseCase = _getProfileUseCase;
        this._getPersonalInfoUseCase = _getPersonalInfoUseCase;
        this._updateUserProfileUseCase = _updateUserProfileUseCase;
        this._updateBodyMetricsUseCase = _updateBodyMetricsUseCase;
    }
    createUserProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                // const files = req.files as MulterFiles;
                const age = parseInt(req.body.age, 10);
                const height = parseFloat(req.body.height);
                const weight = parseFloat(req.body.weight);
                const targetWeight = parseFloat(req.body.targetWeight);
                const data = {
                    userId,
                    age,
                    gender: req.body.gender,
                    height,
                    weight,
                    fitnessGoal: req.body.fitnessGoal,
                    targetWeight,
                    experienceLevel: req.body.experienceLevel,
                    workoutLocation: req.body.workoutLocation,
                };
                // Optional fields
                if (req.body.dietPreference) {
                    data.dietPreference = req.body.dietPreference;
                }
                if (req.body.preferredWorkoutTypes) {
                    try {
                        data.preferredWorkoutTypes = JSON.parse(req.body.preferredWorkoutTypes);
                    }
                    catch (e) {
                        throw new exceptions_1.InvalidDataException('Invalid workout types format');
                    }
                }
                if (req.body.medicalConditions) {
                    try {
                        data.medicalConditions = JSON.parse(req.body.medicalConditions);
                    }
                    catch (e) {
                        data.medicalConditions = [req.body.medicalConditions];
                    }
                }
                // if (files['profileImage']?.[0]) {
                //   data.profileImage = multerFileToFileConverter(files['profileImage'][0]);
                // }
                const result = userBodyMetricsValidator_1.userProfileSchema.safeParse(data);
                if (!result.success) {
                    throw new exceptions_1.InvalidDataException(result.error.issues[0].message);
                }
                const userProfile = yield this._createUserProfileUseCase.createUserProfile(result.data);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.USERS.PROFILE_CREATED_SUCCESSFULLY, { data: userProfile }, 201 /* HTTPStatus.CREATED */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUserProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.NO_USERS_FOUND);
                }
                const result = yield this._getProfileUseCase.execute(userId);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.USERS.GET_USER_PROFILE, { result }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateUserProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const files = req.files;
                if (!userId) {
                    throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.NO_USERS_FOUND);
                }
                if ((_b = files === null || files === void 0 ? void 0 : files['profileImage']) === null || _b === void 0 ? void 0 : _b[0]) {
                    req.body.profileImage = (0, fileConverter_1.multerFileToFileConverter)(files['profileImage'][0]);
                }
                const parseResult = userProfileValidator_1.userPersonalInfoSchema.safeParse(req.body);
                if (parseResult.error) {
                    throw new exceptions_1.InvalidDataException(error_1.Errors.INVALID_DATA);
                }
                const result = yield this._updateUserProfileUseCase.execute(userId, parseResult.data);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.USERS.USER_PROFILE_UPDATED_SUCCESSFULLY, { result }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getBodyMetrics(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.NO_USERS_FOUND);
                }
                const result = yield this._getPersonalInfoUseCase.execute(userId);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.USERS.GET_USER_PERSONAL_INFO, { result }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // --------------------------------------------------
    //              🛠 UPDATE BODY METRICS
    // --------------------------------------------------
    updateBodyMetrics(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.NO_USERS_FOUND);
                }
                const parseResult = userBodyMetricsValidator_1.userBodyMetricsSchema.safeParse(req.body);
                if (parseResult.error) {
                    throw new exceptions_1.InvalidDataException(error_1.Errors.INVALID_DATA);
                }
                const result = yield this._updateBodyMetricsUseCase.execute(userId, parseResult.data);
                responseHelper_1.ResponseHelper.success(res, messages_1.MESSAGES.USERS.USER_PROFILE_UPDATED_SUCCESSFULLY, { result }, 200 /* HTTPStatus.OK */);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.UserProfileController = UserProfileController;
