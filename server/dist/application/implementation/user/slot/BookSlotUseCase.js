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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookSlotUseCase = void 0;
const exceptions_1 = require("../../../constants/exceptions");
const error_1 = require("../../../../shared/constants/error");
const crypto_1 = __importDefault(require("crypto"));
const videoCallEnums_1 = require("../../../../domain/enum/videoCallEnums");
const videoCallMappers_1 = require("../../../mappers/videoCallMappers");
const userEnums_1 = require("../../../../domain/enum/userEnums");
const NotificationEnums_1 = require("../../../../domain/enum/NotificationEnums");
class BookSlotUseCase {
    constructor(_userRepository, _slotRepository, _videoCallRepository, _createNotification) {
        this._userRepository = _userRepository;
        this._slotRepository = _slotRepository;
        this._videoCallRepository = _videoCallRepository;
        this._createNotification = _createNotification;
    }
    bookSlot(userId, slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findById(userId);
            if (!user) {
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.USER_NOT_FOUND);
            }
            const slot = yield this._slotRepository.findById(slotId);
            if (!slot) {
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.SLOT_NOT_FOUND);
            }
            if (new Date(slot.startTime) < new Date()) {
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.CONNOT_BOOK_SLOT_THAT_ALREADY_PASSED);
            }
            const dateStr = new Date(slot.startTime).toISOString().split('T')[0];
            const startOfDay = new Date(`${dateStr}T00:00:00.000Z`);
            const endOfDay = new Date(`${dateStr}T23:59:59.999Z`);
            const hasBookingToday = yield this._videoCallRepository.checkUserBookingForDay(userId, startOfDay, endOfDay);
            if (hasBookingToday) {
                throw new exceptions_1.InvalidDataException(error_1.USER_ERRORS.YOUR_HAVE_ALREADY_BOOKED_A_SEESSION_FOR_THIS_DAY);
            }
            const roomId = crypto_1.default.randomBytes(16).toString("hex");
            const updatedSlot = yield this._slotRepository.updateSlotBooking(slotId, userId);
            if (!updatedSlot) {
                throw new exceptions_1.ConflictException(error_1.USER_ERRORS.SLOT_NOT_FOUND);
            }
            const data = {
                _id: '',
                userId: userId,
                trainerId: slot.trainerId,
                slotId,
                roomId,
                trainerJoined: false,
                userJoined: false,
                startTime: slot.startTime,
                endTime: slot.endTime,
                status: videoCallEnums_1.VideoCallStatus.WAITING,
            };
            const videoCallData = videoCallMappers_1.VideoCallMapper.toEnitity(data);
            yield this._videoCallRepository.save(videoCallData);
            yield this._createNotification.execute({
                recipientId: slot.trainerId,
                recipientRole: userEnums_1.UserRole.TRAINER,
                type: NotificationEnums_1.NotificationType.SLOT_BOOKED,
                title: "Slot Booked!",
                message: `${user.name} has booked a slot with you for ${new Date(slot.startTime).toLocaleString()}.`,
                relatedId: slot._id,
                isRead: false
            });
            return updatedSlot;
        });
    }
}
exports.BookSlotUseCase = BookSlotUseCase;
