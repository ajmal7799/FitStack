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
exports.JoinSessionUseCase = void 0;
const exceptions_1 = require("../../constants/exceptions");
const videoCallEnums_1 = require("../../../domain/enum/videoCallEnums");
class JoinSessionUseCase {
    constructor(_slotRepository, _videoCallRepository) {
        this._slotRepository = _slotRepository;
        this._videoCallRepository = _videoCallRepository;
    }
    execute(userId, slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            const slot = yield this._videoCallRepository.findById(slotId);
            if (!slot || slot.status == videoCallEnums_1.VideoCallStatus.COMPLETED || slot.status == videoCallEnums_1.VideoCallStatus.MISSED) {
                throw new exceptions_1.NotFoundException("Valid booked slot not found.");
            }
            // 2. Validate Time Window (Allow joining 5 mins early, for example)
            const now = new Date();
            const bufferMillis = 5 * 60 * 1000;
            if (now.getTime() < new Date(slot.startTime).getTime() - bufferMillis) {
                throw new exceptions_1.ForbiddenException("Session has not started yet.");
            }
            if (now.getTime() > new Date(slot.endTime).getTime()) {
                throw new exceptions_1.ForbiddenException("This session has already ended.");
            }
            // 3. Find the Video Session
            const session = yield this._videoCallRepository.findById(slotId);
            if (!session)
                throw new exceptions_1.NotFoundException("Video session record missing.");
            // 4. Update Join Flags
            const isTrainer = userId === slot.trainerId;
            const isUser = userId === slot.userId;
            if (!isTrainer && !isUser) {
                throw new exceptions_1.ForbiddenException("You are not authorized to join this session.");
            }
            const updateData = {};
            if (isTrainer)
                updateData.trainerJoined = true;
            if (isUser)
                updateData.userJoined = true;
            // 5. Check if session should become ACTIVE
            // Logic: If the other person is already there, or joining now makes both present
            const willBothBePresent = (isTrainer && session.userJoined) ||
                (isUser && session.trainerJoined) ||
                (session.userJoined && session.trainerJoined);
            if (willBothBePresent && session.status === videoCallEnums_1.VideoCallStatus.WAITING) {
                updateData.status = videoCallEnums_1.VideoCallStatus.ACTIVE;
                updateData.startedAt = new Date();
            }
            yield this._videoCallRepository.update(session._id, updateData);
            return { roomId: session.roomId };
        });
    }
}
exports.JoinSessionUseCase = JoinSessionUseCase;
