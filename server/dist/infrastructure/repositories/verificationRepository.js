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
exports.VerificationRepository = void 0;
const baseRepository_1 = require("./baseRepository");
const verificationMappers_1 = require("../../application/mappers/verificationMappers");
const trainerMappers_1 = require("../../application/mappers/trainerMappers");
const userMappers_1 = require("../../application/mappers/userMappers");
const exceptions_1 = require("../../application/constants/exceptions");
const error_1 = require("../../shared/constants/error");
const verificationStatus_1 = require("../../domain/enum/verificationStatus");
class VerificationRepository extends baseRepository_1.BaseRepository {
    constructor(_model) {
        super(_model, verificationMappers_1.VerificationMapper);
        this._model = _model;
    }
    updateTrainerVerification(trainerId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedDoc = yield this._model.findOneAndUpdate({ trainerId: trainerId }, { $set: data }, { new: true, upsert: true });
            if (!updatedDoc)
                return null;
            return verificationMappers_1.VerificationMapper.fromMongooseDocument(updatedDoc);
        });
    }
    findByTrainerId(trainerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const verificationDoc = yield this._model.findOne({ trainerId: trainerId });
            if (!verificationDoc) {
                return null;
            }
            return verificationMappers_1.VerificationMapper.fromMongooseDocument(verificationDoc);
        });
    }
    findAllVerification(skip, limit, status, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const pipeline = [];
            pipeline.push({
                $lookup: {
                    from: 'trainers',
                    localField: 'trainerId',
                    foreignField: 'trainerId',
                    as: 'trainerData',
                },
            }, {
                $lookup: {
                    from: 'users',
                    let: { trainerIdStr: '$trainerId' },
                    pipeline: [{ $match: { $expr: { $eq: [{ $toString: '$_id' }, '$$trainerIdStr'] } } }],
                    as: 'userData',
                },
            }, { $unwind: '$trainerData' }, { $unwind: '$userData' });
            const matchStage = {};
            if (status) {
                matchStage.verificationStatus = status;
            }
            if (search) {
                matchStage.$or = [
                    { 'userData.name': { $regex: search, $options: 'i' } },
                    { 'userData.email': { $regex: search, $options: 'i' } },
                ];
            }
            if (Object.keys(matchStage).length > 0) {
                pipeline.push({ $match: matchStage });
            }
            if (skip !== undefined)
                pipeline.push({ $skip: skip });
            if (limit !== undefined)
                pipeline.push({ $limit: limit });
            const docs = yield this._model.aggregate(pipeline).exec();
            return docs.map(doc => ({
                verification: verificationMappers_1.VerificationMapper.fromMongooseDocument(doc),
                trainer: trainerMappers_1.TrainerMapper.fromMongooseDocument(doc.trainerData),
                user: userMappers_1.UserMapper.fromMongooseDocument(doc.userData),
            }));
        });
    }
    countVerifications(status_1, search_1) {
        return __awaiter(this, arguments, void 0, function* (status, search, extraQuery = {}) {
            const pipeline = [];
            const matchStage = Object.assign({}, extraQuery);
            if (status)
                matchStage.verificationStatus = status;
            pipeline.push({
                $lookup: {
                    from: 'users',
                    let: { trainerIdStr: '$trainerId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: [{ $toString: '$_id' }, '$$trainerIdStr'] },
                            },
                        },
                    ],
                    as: 'userData',
                },
            }, { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } });
            if (search) {
                matchStage.$or = [
                    { 'userData.name': { $regex: search, $options: 'i' } },
                    { 'userData.email': { $regex: search, $options: 'i' } },
                ];
            }
            pipeline.push({ $match: matchStage });
            pipeline.push({ $count: 'count' });
            const result = yield this._model.aggregate(pipeline).exec();
            return result.length > 0 ? result[0].count : 0;
        });
    }
    findVerificationByTrainerId(trainerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const pipeline = [];
            pipeline.push({
                $match: { trainerId },
            });
            pipeline.push({
                $lookup: {
                    from: 'trainers',
                    localField: 'trainerId',
                    foreignField: 'trainerId',
                    as: 'trainerData',
                },
            });
            // Lookup user
            pipeline.push({
                $lookup: {
                    from: 'users',
                    let: { trainerIdStr: '$trainerId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: [{ $toString: '$_id' }, '$$trainerIdStr'] },
                            },
                        },
                    ],
                    as: 'userData',
                },
            });
            pipeline.push({ $unwind: { path: '$trainerData', preserveNullAndEmptyArrays: true } }, { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } });
            const docs = yield this._model.aggregate(pipeline).exec();
            if (!docs || docs.length === 0) {
                throw new exceptions_1.NotFoundException(error_1.TRAINER_ERRORS.TRAINER_VERIFICATION_NOT_FOUND);
            }
            const doc = docs[0];
            return {
                verification: verificationMappers_1.VerificationMapper.fromMongooseDocument(doc),
                trainer: trainerMappers_1.TrainerMapper.fromMongooseDocument(doc.trainerData),
                user: userMappers_1.UserMapper.fromMongooseDocument(doc.userData),
            };
        });
    }
    verifyTrainer(trainerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedDoc = yield this._model.findOneAndUpdate({ trainerId: trainerId }, { $set: { verificationStatus: verificationStatus_1.VerificationStatus.VERIFIED, rejectionReason: null } }, { new: true, upsert: true });
            if (!updatedDoc)
                return null;
            return verificationMappers_1.VerificationMapper.fromMongooseDocument(updatedDoc);
        });
    }
    rejectTrainer(trainerId, rejectionReason) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedDoc = yield this._model.findOneAndUpdate({ trainerId: trainerId }, { $set: { verificationStatus: verificationStatus_1.VerificationStatus.REJECTED, rejectionReason: rejectionReason } }, { new: true, upsert: true });
            if (!updatedDoc)
                return null;
            return verificationMappers_1.VerificationMapper.fromMongooseDocument(updatedDoc);
        });
    }
    allVerifiedTrainer(skip, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const pipeline = [];
            pipeline.push({
                $match: { verificationStatus: verificationStatus_1.VerificationStatus.VERIFIED },
            });
            pipeline.push({
                $lookup: {
                    from: 'trainers',
                    localField: 'trainerId',
                    foreignField: 'trainerId',
                    as: 'trainerData',
                },
            }, {
                $lookup: {
                    from: 'users',
                    let: { trainerIdStr: '$trainerId' },
                    pipeline: [{ $match: { $expr: { $eq: [{ $toString: '$_id' }, '$$trainerIdStr'] } } }],
                    as: 'userData',
                },
            }, { $unwind: { path: '$trainerData', preserveNullAndEmptyArrays: true } }, { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } });
            if (search) {
                const matchStage = {};
                matchStage.$or = [
                    { 'userData.name': { $regex: search, $options: 'i' } },
                    { 'userData.email': { $regex: search, $options: 'i' } },
                ];
                pipeline.push({ $match: matchStage });
            }
            if (skip)
                pipeline.push({ $skip: skip });
            if (limit)
                pipeline.push({ $limit: limit });
            const docs = yield this._model.aggregate(pipeline).exec();
            return docs.map(doc => ({
                verification: verificationMappers_1.VerificationMapper.fromMongooseDocument(doc),
                trainer: trainerMappers_1.TrainerMapper.fromMongooseDocument(doc.trainerData),
                user: userMappers_1.UserMapper.fromMongooseDocument(doc.userData),
            }));
        });
    }
    countVerifiedTrainer(search) {
        return __awaiter(this, void 0, void 0, function* () {
            const initialMatch = { VerificationStatus: verificationStatus_1.VerificationStatus.VERIFIED };
            const pipeline = [];
            pipeline.push({ $match: initialMatch });
            if (search) {
                const searchMatch = {
                    $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }],
                };
                pipeline.push({ $match: searchMatch });
            }
            // 4. Use the $count stage for efficient counting in MongoDB.
            pipeline.push({ $count: 'verifiedTrainerCount' });
            const result = yield this._model.aggregate(pipeline).exec();
            return result.length > 0 ? result[0].verifiedTrainerCount : 0;
        });
    }
}
exports.VerificationRepository = VerificationRepository;
