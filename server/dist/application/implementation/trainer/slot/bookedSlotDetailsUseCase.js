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
exports.BookedSlotDetailsUseCase = void 0;
const exceptions_1 = require("../../../constants/exceptions");
const error_1 = require("../../../../shared/constants/error");
class BookedSlotDetailsUseCase {
    constructor(_videoCallRepository, _userRepository, _storageService) {
        this._videoCallRepository = _videoCallRepository;
        this._userRepository = _userRepository;
        this._storageService = _storageService;
    }
    getBookedSlotDetails(trainerId, slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            const slot = yield this._videoCallRepository.findById(slotId);
            if (!slot) {
                throw new exceptions_1.NotFoundException(error_1.Errors.SLOT_NOT_FOUND);
            }
            if (slot.trainerId !== trainerId) {
                throw new exceptions_1.UnauthorizedException('You do not have permission to view this slot.');
            }
            const user = yield this._userRepository.findById(slot.userId || '');
            if (!user) {
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.USER_NOT_FOUND);
            }
            let profileImageUrl = user.profileImage || '';
            if (profileImageUrl) {
                profileImageUrl = yield this._storageService.createSignedUrl(profileImageUrl, 10 * 60);
            }
            return {
                _id: slot._id,
                profileImage: profileImageUrl,
                userName: user.name,
                userEmail: user.email,
                startTime: slot.startTime,
                endTime: slot.endTime,
                slotStatus: slot.status,
                cancellationReason: slot.cancellationReason || null,
                cancelledAt: slot.cancelledAt || null,
                cancelledBy: slot.cancelledBy || null,
                // cancellationReason: slot.cancellationReason? slot.cancellationReason : "",
            };
        });
    }
}
exports.BookedSlotDetailsUseCase = BookedSlotDetailsUseCase;
