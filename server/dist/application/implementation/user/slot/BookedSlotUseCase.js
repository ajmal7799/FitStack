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
exports.BookedSlotUseCase = void 0;
const exceptions_1 = require("../../../constants/exceptions");
const error_1 = require("../../../../shared/constants/error");
class BookedSlotUseCase {
    constructor(_userRepository, _trainerSelectRepository, _videoCallRepository) {
        this._userRepository = _userRepository;
        this._trainerSelectRepository = _trainerSelectRepository;
        this._videoCallRepository = _videoCallRepository;
    }
    getBookedSlots(userId, page, limit, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            // 1. Check for trainer selection
            const selectedTrainer = yield this._trainerSelectRepository.findByUserId(userId);
            if (!selectedTrainer) {
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.USER_NOT_SELECTED);
            }
            // 2. Fetch trainer details and slot data in parallel for efficiency
            const [trainer, slots, totalSlots] = yield Promise.all([
                this._userRepository.findById(selectedTrainer.trainerId),
                this._videoCallRepository.findAllBookedSessionByUserId(userId, skip, limit, status),
                this._videoCallRepository.countBookedSessionByUserId(userId, status),
            ]);
            if (!trainer) {
                throw new exceptions_1.NotFoundException(error_1.TRAINER_ERRORS.TRAINER_NOT_FOUND);
            }
            // 3. Map the retrieved slots (from the Promise.all result) to DTOs
            const bookedSlotsDTO = slots.map(slot => ({
                _id: slot._id,
                trainerName: trainer.name,
                startTime: slot.startTime,
                endTime: slot.endTime,
                slotStatus: slot.status,
            }));
            // 4. Return the full pagination object
            return {
                slots: bookedSlotsDTO,
                totalSlots: totalSlots,
                totalePages: Math.ceil(totalSlots / limit) || 1,
                currentPage: page,
            };
        });
    }
}
exports.BookedSlotUseCase = BookedSlotUseCase;
