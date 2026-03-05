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
exports.BookedSlotsUseCase = void 0;
class BookedSlotsUseCase {
    constructor(_videoCallRepository, _userRepository, _storageService) {
        this._videoCallRepository = _videoCallRepository;
        this._userRepository = _userRepository;
        this._storageService = _storageService;
    }
    getBookedSlots(trainerId, page, limit, status, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const [slots, totalSlots] = yield Promise.all([
                this._videoCallRepository.findAllBookedSessionByTrainerId(trainerId, skip, limit, status, search),
                this._videoCallRepository.countBookedSessionByTrainerId(trainerId, status, search),
            ]);
            const mappedSlots = yield Promise.all(slots.map((slot) => __awaiter(this, void 0, void 0, function* () {
                const trainee = yield this._userRepository.findById(slot.userId || '');
                let profileImageUrl = '';
                if (trainee === null || trainee === void 0 ? void 0 : trainee.profileImage) {
                    profileImageUrl = yield this._storageService.createSignedUrl(trainee.profileImage, 10 * 60);
                }
                return {
                    _id: slot._id,
                    userName: (trainee === null || trainee === void 0 ? void 0 : trainee.name) || 'Unknown User',
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    slotStatus: slot.status,
                    profileImage: profileImageUrl,
                };
            })));
            // 3. Return the formatted paginated response
            return {
                slots: mappedSlots,
                totalSlots: totalSlots,
                totalePages: Math.ceil(totalSlots / limit) || 1,
                currentPage: page,
            };
        });
    }
}
exports.BookedSlotsUseCase = BookedSlotsUseCase;
