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
exports.SlotRepository = void 0;
const slotMappers_1 = require("../../application/mappers/slotMappers");
const baseRepository_1 = require("./baseRepository");
const exceptions_1 = require("../../application/constants/exceptions");
const error_1 = require("../../shared/constants/error");
const SlotEnums_1 = require("../../domain/enum/SlotEnums");
class SlotRepository extends baseRepository_1.BaseRepository {
    constructor(_model) {
        super(_model, slotMappers_1.SlotMapper);
        this._model = _model;
    }
    isOverLapping(trainerId, startTime, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const start = new Date(startTime);
            const end = new Date(endTime);
            const existingOverlap = yield this._model.findOne({
                trainerId: trainerId,
                $and: [{ startTime: { $lt: end } }, { endTime: { $gt: start } }],
                slotStatus: { $in: [SlotEnums_1.SlotStatus.AVAILABLE, SlotEnums_1.SlotStatus.BOOKED] },
            });
            return existingOverlap ? true : false;
        });
    }
    findAllSlots(trainerId, skip, limit, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const query = { trainerId };
            let sort = { startTime: -1 };
            switch (status) {
                case 'upcoming':
                    query.startTime = { $gt: now };
                    sort = { startTime: 1 };
                    break;
                case 'booked':
                    query.isBooked = true;
                    query.startTime = { $gt: now }; // Usually "Booked" refers to upcoming appointments
                    break;
                case 'past':
                    query.startTime = { $lt: now };
                    sort = { startTime: -1 };
                    break;
                case 'all':
                default:
                    sort = { createdAt: -1 }; // Newest dates (furthest in future) appear first
                    break;
            }
            const slots = yield this._model.find(query).sort(sort).skip(skip).limit(limit);
            return slots.map(slot => slotMappers_1.SlotMapper.fromMongooseDocument(slot));
        });
    }
    countSlots(trainerId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const query = { trainerId };
            switch (status) {
                case 'upcoming':
                    query.startTime = { $gt: now };
                    break;
                case 'booked':
                    query.isBooked = true;
                    query.startTime = { $gt: now };
                    break;
                case 'past':
                    query.startTime = { $lt: now };
                    break;
                case 'all':
                default:
                    // No additional filters for 'all'
                    break;
            }
            return yield this._model.countDocuments(query);
        });
    }
    findAllAvailableSlots(trainerId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const OFFSET_HOURS = 5.5; // IST = UTC+5:30 — change to your timezone
            const OFFSET_MS = OFFSET_HOURS * 60 * 60 * 1000;
            // Convert local midnight to UTC
            // "2026-01-26" local 00:00 IST = "2026-01-25T18:30:00.000Z"
            const startOfDay = new Date(new Date(`${date}T00:00:00.000Z`).getTime() - OFFSET_MS);
            const endOfDay = new Date(new Date(`${date}T23:59:59.999Z`).getTime() - OFFSET_MS);
            const now = new Date();
            // Use endTime > now so slots that already started but haven't ended are still shown
            const isToday = now >= startOfDay && now <= endOfDay;
            const slots = yield this._model
                .find(Object.assign({ trainerId, slotStatus: SlotEnums_1.SlotStatus.AVAILABLE, startTime: { $gte: startOfDay, $lte: endOfDay } }, (isToday && { endTime: { $gt: now } })))
                .sort({ startTime: 1 });
            return slots.map(slot => slotMappers_1.SlotMapper.fromMongooseDocument(slot));
        });
    }
    checkUserBookingForDay(userId, startTime, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield this._model.countDocuments({
                bookedBy: userId,
                slotStatus: SlotEnums_1.SlotStatus.BOOKED,
                startTime: {
                    $gte: new Date(startTime),
                    $lte: new Date(endTime),
                },
            });
            return count > 0;
        });
    }
    updateSlotBooking(slotId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateDoc = yield this._model.findOneAndUpdate({
                _id: slotId,
            }, {
                $set: {
                    isBooked: true,
                    bookedBy: userId,
                    slotStatus: SlotEnums_1.SlotStatus.BOOKED,
                    cancellationReason: null,
                },
            }, {
                new: true,
            });
            if (!updateDoc) {
                return null;
            }
            return slotMappers_1.SlotMapper.fromMongooseDocument(updateDoc);
        });
    }
    deleteById(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._model.deleteOne({ _id: slotId, isBooked: false });
            if (!result) {
                throw new exceptions_1.ConflictException(error_1.TRAINER_ERRORS.COULD_NOT_DELETE_SLOT);
            }
        });
    }
    createMany(slots) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdDocs = yield this._model.insertMany(slots);
            return createdDocs.map(doc => {
                const plainDoc = doc.toObject();
                return slotMappers_1.SlotMapper.fromMongooseDocument(plainDoc);
            });
        });
    }
    findAllBookedSlotsByUserId(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, skip = 0, limit = 5) {
            const query = {
                bookedBy: userId,
                // startTime: {$gt:new Date() }
                // isBooked: true,
                // slotStatus: SlotStatus.BOOKED,
            };
            const slots = yield this._model.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
            return slots.map(slot => slotMappers_1.SlotMapper.fromMongooseDocument(slot));
        });
    }
    countBookedSlotsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._model.countDocuments({
                bookedBy: userId,
                // slotStatus: SlotStatus.BOOKED,
                // isBooked: true
            });
        });
    }
    updateSlotStatus(slotId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._model.findByIdAndUpdate(slotId, {
                $set: Object.assign({}, data),
            });
        });
    }
    findTrainerSessions(trainerId_1) {
        return __awaiter(this, arguments, void 0, function* (trainerId, skip = 0, limit = 5) {
            const query = {
                trainerId: trainerId,
                isBooked: true,
                // slotStatus: SlotStatus.BOOKED ,
                endTime: {
                    $gte: new Date(),
                },
            };
            const slots = yield this._model.find(query).sort({ startTime: 1 }).skip(skip).limit(limit);
            return slots.map(slot => slotMappers_1.SlotMapper.fromMongooseDocument(slot));
        });
    }
    countTrainerSessions(trainerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._model.countDocuments({ trainerId, isBooked: true, endTime: { $gte: new Date() } });
        });
    }
}
exports.SlotRepository = SlotRepository;
