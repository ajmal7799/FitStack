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
exports.VideoCallRepository = void 0;
const videoCallMappers_1 = require("../../application/mappers/videoCallMappers");
const videoCallEnums_1 = require("../../domain/enum/videoCallEnums");
const baseRepository_1 = require("./baseRepository");
const mongoose_1 = require("mongoose");
class VideoCallRepository extends baseRepository_1.BaseRepository {
    constructor(_model) {
        super(_model, videoCallMappers_1.VideoCallMapper);
        this._model = _model;
    }
    findBySlotId(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            const videoCall = yield this._model.findOne({ slotId });
            return videoCall ? videoCallMappers_1.VideoCallMapper.fromMongooseDocument(videoCall) : null;
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedDoc = yield this._model.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
            if (!updatedDoc)
                return null;
            return videoCallMappers_1.VideoCallMapper.fromMongooseDocument(updatedDoc);
        });
    }
    findAllExpiredSession(now) {
        return __awaiter(this, void 0, void 0, function* () {
            const videoCalls = yield this._model.find({
                endTime: { $lt: now },
                status: { $in: [videoCallEnums_1.VideoCallStatus.WAITING, videoCallEnums_1.VideoCallStatus.ACTIVE] },
            });
            return videoCalls.map(videoCall => videoCallMappers_1.VideoCallMapper.fromMongooseDocument(videoCall));
        });
    }
    updateStatus(slotId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._model.updateOne({ slotId: slotId }, { $set: { status: status } });
        });
    }
    findSessionsByUserId(userId, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {
                userId: userId,
                status: videoCallEnums_1.VideoCallStatus.COMPLETED,
            };
            const videoCalls = yield this._model.find(filter).sort({ startTime: -1 }).skip(skip).limit(limit);
            return videoCalls.map(videoCall => videoCallMappers_1.VideoCallMapper.fromMongooseDocument(videoCall));
        });
    }
    countSessionsByUserId(userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {
                userId: userId,
                status: { $in: [videoCallEnums_1.VideoCallStatus.COMPLETED] },
            };
            if (status) {
                filter.status = status;
            }
            return yield this._model.countDocuments(filter);
        });
    }
    findSessionsByTrainerId(trainerId, skip, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchStage = {
                trainerId: new mongoose_1.Types.ObjectId(trainerId),
                status: videoCallEnums_1.VideoCallStatus.COMPLETED,
            };
            const pipeline = [
                { $match: matchStage },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user',
                    },
                },
                { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
                ...((search === null || search === void 0 ? void 0 : search.trim())
                    ? [{ $match: { 'user.name': { $regex: search.trim(), $options: 'i' } } }]
                    : []),
                { $sort: { startTime: -1 } },
                { $skip: skip },
                { $limit: limit },
            ];
            const results = yield this._model.aggregate(pipeline);
            return results.map(videoCall => videoCallMappers_1.VideoCallMapper.fromMongooseDocument(videoCall));
        });
    }
    countSessionsByTrainerId(trainerId, search) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const matchStage = {
                trainerId: new mongoose_1.Types.ObjectId(trainerId),
                status: videoCallEnums_1.VideoCallStatus.COMPLETED,
            };
            const pipeline = [
                { $match: matchStage },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user',
                    },
                },
                { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
                ...((search === null || search === void 0 ? void 0 : search.trim())
                    ? [{ $match: { 'user.name': { $regex: search.trim(), $options: 'i' } } }]
                    : []),
                { $count: 'total' },
            ];
            const result = yield this._model.aggregate(pipeline);
            return (_b = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.total) !== null && _b !== void 0 ? _b : 0;
        });
    }
    findSessionsForAdmin(skip, limit, status, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const pipeline = [
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDoc',
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'trainerId',
                        foreignField: '_id',
                        as: 'trainerDoc',
                    },
                },
                {
                    $match: Object.assign(Object.assign({}, (status && { status })), (search && {
                        $or: [
                            { 'userDoc.name': { $regex: search, $options: 'i' } },
                            { 'trainerDoc.name': { $regex: search, $options: 'i' } },
                        ],
                    })),
                },
                { $sort: { startTime: -1 } },
                { $skip: skip },
                { $limit: limit },
            ];
            const result = yield this._model.aggregate(pipeline);
            return result.map(doc => {
                var _a, _b;
                const videoCall = videoCallMappers_1.VideoCallMapper.fromMongooseDocument(doc);
                videoCall.userName = (_a = doc.userDoc[0]) === null || _a === void 0 ? void 0 : _a.name;
                videoCall.trainerName = (_b = doc.trainerDoc[0]) === null || _b === void 0 ? void 0 : _b.name;
                return videoCall;
            });
        });
    }
    countSessionsForAdmin(status, search) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const pipeline = [
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDoc',
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'trainerId',
                        foreignField: '_id',
                        as: 'trainerDoc',
                    },
                },
                {
                    $match: Object.assign(Object.assign({}, (status && { status })), (search && {
                        $or: [
                            { 'userDoc.name': { $regex: search, $options: 'i' } },
                            { 'trainerDoc.name': { $regex: search, $options: 'i' } },
                        ],
                    })),
                },
                { $count: 'total' },
            ];
            const result = yield this._model.aggregate(pipeline);
            return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
        });
    }
    findAllBookedSessionByUserId(userId, skip, limit, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {
                userId: userId,
                // status: { $in: [VideoCallStatus.ACTIVE, VideoCallStatus.WAITING] },
            };
            if (status) {
                filter.status = status;
            }
            const videoCalls = yield this._model.find(filter).sort({ startTime: 1 }).skip(skip).limit(limit);
            return videoCalls.map(videoCall => videoCallMappers_1.VideoCallMapper.fromMongooseDocument(videoCall));
        });
    }
    countBookedSessionByUserId(userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {
                userId: userId,
                // status: { $in: [VideoCallStatus.ACTIVE, VideoCallStatus.WAITING] },
            };
            if (status) {
                filter.status = status;
            }
            return yield this._model.countDocuments(filter);
        });
    }
    findAllBookedSessionByTrainerId(trainerId, skip, limit, status, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchStage = {
                trainerId: new mongoose_1.Types.ObjectId(trainerId), // ✅ fixed
            };
            if (status) {
                matchStage.status = status;
            }
            const pipeline = [
                { $match: matchStage },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user',
                    },
                },
                { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
                ...((search === null || search === void 0 ? void 0 : search.trim())
                    ? [
                        {
                            $match: {
                                'user.name': { $regex: search.trim(), $options: 'i' },
                            },
                        },
                    ]
                    : []),
                { $sort: { startTime: -1 } },
                { $skip: skip },
                { $limit: limit },
            ];
            const videoCalls = yield this._model.aggregate(pipeline);
            return videoCalls.map(videoCall => videoCallMappers_1.VideoCallMapper.fromMongooseDocument(videoCall));
        });
    }
    countBookedSessionByTrainerId(trainerId, status, search) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const matchStage = {
                trainerId: new mongoose_1.Types.ObjectId(trainerId), // ✅ fixed
            };
            if (status) {
                matchStage.status = status;
            }
            const pipeline = [
                { $match: matchStage },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user',
                    },
                },
                { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
                ...((search === null || search === void 0 ? void 0 : search.trim())
                    ? [
                        {
                            $match: {
                                'user.name': { $regex: search.trim(), $options: 'i' },
                            },
                        },
                    ]
                    : []),
                { $count: 'total' },
            ];
            const result = yield this._model.aggregate(pipeline);
            return (_b = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.total) !== null && _b !== void 0 ? _b : 0;
        });
    }
    checkUserBookingForDay(userId, startTime, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this._model.findOne({
                userId,
                startTime: { $gte: startTime, $lte: endTime },
                status: {
                    $in: [videoCallEnums_1.VideoCallStatus.ACTIVE, videoCallEnums_1.VideoCallStatus.WAITING, videoCallEnums_1.VideoCallStatus.COMPLETED, videoCallEnums_1.VideoCallStatus.CANCELLED],
                },
            });
            return !!session;
        });
    }
}
exports.VideoCallRepository = VideoCallRepository;
