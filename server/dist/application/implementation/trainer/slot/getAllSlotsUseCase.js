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
exports.GetAllSlotsUseCase = void 0;
const exceptions_1 = require("../../../constants/exceptions");
const error_1 = require("../../../../shared/constants/error");
class GetAllSlotsUseCase {
    constructor(_userRepository, _slotRepository) {
        this._userRepository = _userRepository;
        this._slotRepository = _slotRepository;
    }
    getAllSlots(trainerId, page, limit, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const trainer = yield this._userRepository.findById(trainerId);
            if (!trainer) {
                throw new exceptions_1.NotFoundException(error_1.TRAINER_ERRORS.TRAINER_NOT_FOUND);
            }
            const skip = (page - 1) * limit;
            const [slots, totalSlots] = yield Promise.all([
                this._slotRepository.findAllSlots(trainerId, skip, limit, status),
                this._slotRepository.countSlots(trainerId, status),
            ]);
            return {
                slots,
                totalSlots,
                totalPages: Math.ceil(totalSlots / limit),
                currentPage: page,
            };
        });
    }
}
exports.GetAllSlotsUseCase = GetAllSlotsUseCase;
