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
exports.RecurringSlotUseCase = void 0;
const exceptions_1 = require("../../../constants/exceptions");
const error_1 = require("../../../../shared/constants/error");
// import {}
class RecurringSlotUseCase {
    constructor(_userRepository, _slotRepository) {
        this._userRepository = _userRepository;
        this._slotRepository = _slotRepository;
    }
    createRecurringSlot(trainerId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Verify Trainer
            const trainer = yield this._userRepository.findById(trainerId);
            if (!trainer) {
                throw new exceptions_1.NotFoundException(error_1.TRAINER_ERRORS.TRAINER_NOT_FOUND);
            }
            const { startDate, endDate, startTime, weekdays } = data;
            const start = new Date(startDate);
            const end = new Date(endDate);
            const [hours, minutes] = startTime.split(':').map(Number);
            const slotsToCreate = [];
            // 2. Loop through each date in the range
            const current = new Date(start);
            while (current <= end) {
                const dayName = current
                    .toLocaleDateString('en-US', { weekday: 'short' })
                    .toUpperCase();
                // 3. Match against selected weekdays
                if (weekdays.includes(dayName)) {
                    const slotStartTime = new Date(current);
                    slotStartTime.setHours(hours, minutes, 0, 0);
                    const slotEndTime = new Date(slotStartTime);
                    slotEndTime.setMinutes(slotStartTime.getMinutes() + 60); // 60 min fixed duration
                    // 4. Overlap Check (using your query)
                    const isOverlapping = yield this._slotRepository.isOverLapping(trainerId, slotStartTime.toISOString(), slotEndTime.toISOString());
                    if (isOverlapping) {
                        throw new Error(`Conflict: Slot already exists on ${slotStartTime.toDateString()} at ${startTime}`);
                    }
                    // 5. Build slot object for insertion
                    slotsToCreate.push({
                        trainerId,
                        startTime: slotStartTime,
                        endTime: slotEndTime,
                        isBooked: false,
                        bookedBy: null,
                    });
                }
                // Move to next day
                current.setDate(current.getDate() + 1);
            }
            if (slotsToCreate.length === 0) {
                throw new Error('No slots generated for the selected date range and weekdays.');
            }
            // 6. Bulk Insert and Map
            return yield this._slotRepository.createMany(slotsToCreate);
        });
    }
}
exports.RecurringSlotUseCase = RecurringSlotUseCase;
