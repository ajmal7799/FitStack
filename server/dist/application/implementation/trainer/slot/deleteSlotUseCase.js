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
exports.DeleteSlotUseCase = void 0;
const exceptions_1 = require("../../../constants/exceptions");
const error_1 = require("../../../../shared/constants/error");
class DeleteSlotUseCase {
    constructor(_slotRepository) {
        this._slotRepository = _slotRepository;
    }
    deleteSlot(slotId, trainerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const slot = yield this._slotRepository.findById(slotId);
            if (!slot) {
                throw new exceptions_1.NotFoundException(error_1.TRAINER_ERRORS.SLOT_NOT_FOUND);
            }
            if (slot.trainerId.toString() !== trainerId) {
                throw new exceptions_1.IsBlockedExecption(error_1.TRAINER_ERRORS.YOU_CAN_ONLY_DELETE_YOUR_OWN_SLOT);
            }
            // if (slot.isBooked) {
            //     throw new InvalidDataException(TRAINER_ERRORS.SLOT_ALREADY_BOOKED);
            // }
            yield this._slotRepository.deleteById(slotId);
        });
    }
}
exports.DeleteSlotUseCase = DeleteSlotUseCase;
