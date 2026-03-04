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
exports.CreateSlotUseCase = void 0;
const exceptions_1 = require("../../../constants/exceptions");
const error_1 = require("../../../../shared/constants/error");
const slotMappers_1 = require("../../../mappers/slotMappers");
const SlotEnums_1 = require("../../../../domain/enum/SlotEnums");
class CreateSlotUseCase {
    constructor(_userRepository, _slotRepository) {
        this._userRepository = _userRepository;
        this._slotRepository = _slotRepository;
    }
    createSlot(trainerId, startTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const trainer = yield this._userRepository.findById(trainerId);
            if (!trainer) {
                throw new exceptions_1.NotFoundException(error_1.TRAINER_ERRORS.TRAINER_NOT_FOUND);
            }
            const start = new Date(startTime);
            const end = new Date(start.getTime() + 60 * 60 * 1000);
            const isOverLapping = yield this._slotRepository.isOverLapping(trainerId, start.toISOString(), end.toISOString());
            if (isOverLapping) {
                throw new exceptions_1.AlreadyExisitingExecption(error_1.TRAINER_ERRORS.SLOT_ALREADY_EXISTS_IN_THAT_TIME);
            }
            const data = {
                _id: '',
                trainerId: trainerId,
                startTime: start,
                endTime: end,
                isBooked: false,
                bookedBy: null,
                slotStatus: SlotEnums_1.SlotStatus.AVAILABLE,
            };
            const slotData = slotMappers_1.SlotMapper.toEntity(data);
            const slot = yield this._slotRepository.save(slotData);
            return slot;
        });
    }
}
exports.CreateSlotUseCase = CreateSlotUseCase;
