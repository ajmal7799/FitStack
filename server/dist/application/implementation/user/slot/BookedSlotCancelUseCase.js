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
exports.BookedSlotCancelUseCase = void 0;
const exceptions_1 = require("../../../constants/exceptions");
const SlotEnums_1 = require("../../../../domain/enum/SlotEnums");
const videoCallEnums_1 = require("../../../../domain/enum/videoCallEnums");
const userEnums_1 = require("../../../../domain/enum/userEnums");
const NotificationEnums_1 = require("../../../../domain/enum/NotificationEnums");
const WalletTransactionType_1 = require("../../../../domain/enum/WalletTransactionType");
class BookedSlotCancelUseCase {
    constructor(_slotRepository, _videoCallRepository, _createNotification, _walletRepository, _membershipRepository, _subscriptionRepository) {
        this._slotRepository = _slotRepository;
        this._videoCallRepository = _videoCallRepository;
        this._createNotification = _createNotification;
        this._walletRepository = _walletRepository;
        this._membershipRepository = _membershipRepository;
        this._subscriptionRepository = _subscriptionRepository;
    }
    cancelBookedSlot(userId, slotId, reason, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this._videoCallRepository.findById(slotId);
            // 2. Check existence
            if (!session) {
                throw new exceptions_1.NotFoundException('Session not found for this slot');
            }
            console.log('session', session.status);
            // 3. Status Validation: Only 'WAITING' sessions can be cancelled
            if (session.status !== videoCallEnums_1.VideoCallStatus.WAITING) {
                throw new exceptions_1.ConflictException(`Cannot cancel session with status: ${session.status}`);
            }
            // 4. Security Check: Role-based authorization using .toString() for ObjectIds
            if (role === userEnums_1.UserRole.USER && session.userId.toString() !== userId) {
                throw new exceptions_1.UnauthorizedException("You cannot cancel someone else's booking");
            }
            if (role === userEnums_1.UserRole.TRAINER && session.trainerId.toString() !== userId) {
                throw new exceptions_1.UnauthorizedException('You are not the assigned trainer for this session');
            }
            // 5. Business Rule: Ensure session hasn't started
            const now = new Date();
            if (new Date(session.startTime) < now) {
                throw new exceptions_1.ConflictException('Cannot cancel a session that has already started or passed');
            }
            yield this._videoCallRepository.update(session._id, {
                status: videoCallEnums_1.VideoCallStatus.CANCELLED,
                cancellationReason: reason.trim(),
                cancelledAt: new Date(),
                cancelledBy: role,
            });
            // 7. Re-open the slot
            if (role === userEnums_1.UserRole.USER) {
                yield this._slotRepository.updateSlotStatus(session.slotId, {
                    isBooked: false,
                    bookedBy: null,
                    slotStatus: SlotEnums_1.SlotStatus.AVAILABLE,
                });
            }
            else {
                yield this._slotRepository.updateSlotStatus(session.slotId, {
                    isBooked: false,
                    bookedBy: null,
                    slotStatus: SlotEnums_1.SlotStatus.CANCELLED,
                });
            }
            // 8. Notify the other party
            const recipientId = role === userEnums_1.UserRole.USER ? session.trainerId : session.userId;
            const recipientRole = role === userEnums_1.UserRole.USER ? userEnums_1.UserRole.TRAINER : userEnums_1.UserRole.USER;
            const cancellerName = role === userEnums_1.UserRole.USER ? 'The user' : 'The trainer';
            yield this._createNotification.execute({
                recipientId: recipientId.toString(),
                recipientRole,
                type: NotificationEnums_1.NotificationType.SESSION_CANCELLED,
                title: 'Session Cancelled',
                message: `${cancellerName} has cancelled the session scheduled for ${new Date(session.startTime).toLocaleString()}.`,
                relatedId: session.slotId.toString(),
                isRead: false,
            });
            if (role === userEnums_1.UserRole.TRAINER) {
                yield this.processRefund(session, 1.0);
            }
            else if (role === userEnums_1.UserRole.USER) {
                const hoursUntil = (new Date(session.startTime).getTime() - Date.now()) / (1000 * 60 * 60);
                const refundPercent = hoursUntil >= 24 ? 1.0 : hoursUntil >= 1 ? 0.5 : 0;
                if (refundPercent > 0) {
                    yield this.processRefund(session, refundPercent);
                }
            }
        });
    }
    processRefund(session_1) {
        return __awaiter(this, arguments, void 0, function* (session, refundPercent = 1.0) {
            try {
                const membership = yield this._membershipRepository.findByUserId(session.userId);
                if (!membership)
                    return;
                const plan = yield this._subscriptionRepository.findById(membership.planId.toString());
                if (!plan)
                    return;
                const sessionRate = parseFloat((plan.price / (plan.durationMonths * 30)).toFixed(2));
                const refundAmount = parseFloat((sessionRate * refundPercent).toFixed(2));
                // ✅ Credit user wallet
                yield this._walletRepository.credit(session.userId, 'user', sessionRate, {
                    type: WalletTransactionType_1.WalletTransactionType.REFUND,
                    amount: sessionRate,
                    description: `Refund (${refundPercent * 100}%) for cancelled session at ${new Date(session.startTime).toLocaleString()}`,
                    relatedId: session._id,
                });
                // ✅ Notify user about refund
                yield this._createNotification.execute({
                    recipientId: session.userId,
                    recipientRole: userEnums_1.UserRole.USER,
                    type: NotificationEnums_1.NotificationType.REFUND,
                    title: '💸 Refund Processed!',
                    message: `₹${refundAmount} has been refunded to your wallet for the cancelled session.`,
                    relatedId: session._id,
                    isRead: false,
                });
            }
            catch (error) {
                console.error('❌ Error processing refund:', error);
            }
        });
    }
}
exports.BookedSlotCancelUseCase = BookedSlotCancelUseCase;
