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
exports.EndVideoCallSessionUseCase = void 0;
const videoCallEnums_1 = require("../../../domain/enum/videoCallEnums");
const SlotEnums_1 = require("../../../domain/enum/SlotEnums");
const exceptions_1 = require("../../constants/exceptions");
const WalletTransactionType_1 = require("../../../domain/enum/WalletTransactionType");
const userEnums_1 = require("../../../domain/enum/userEnums");
const NotificationEnums_1 = require("../../../domain/enum/NotificationEnums");
const config_1 = require("../../../infrastructure/config/config");
const PLATFORM_FEE_PERCENT = 0.2;
const TRAINER_COMMISSION_PERCENT = 0.8;
const ADMIN_ID = 'platform_admin'; // fixed admin wallet owner
class EndVideoCallSessionUseCase {
    constructor(_videoCallRepository, _slotRepository, _walletRepository, _membershipRepository, _subscriptionRepository, _createNotification) {
        this._videoCallRepository = _videoCallRepository;
        this._slotRepository = _slotRepository;
        this._walletRepository = _walletRepository;
        this._membershipRepository = _membershipRepository;
        this._subscriptionRepository = _subscriptionRepository;
        this._createNotification = _createNotification;
    }
    execute(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this._videoCallRepository.findById(slotId);
            if (!session)
                throw new exceptions_1.NotFoundException('Session not found');
            if (session.status == videoCallEnums_1.VideoCallStatus.COMPLETED || session.status == videoCallEnums_1.VideoCallStatus.MISSED) {
                throw new exceptions_1.AlreadyExisitingExecption('Session already ended');
            }
            const now = new Date();
            let newStatus;
            if (session.startedAt) {
                newStatus = videoCallEnums_1.VideoCallStatus.COMPLETED;
            }
            else {
                newStatus = videoCallEnums_1.VideoCallStatus.MISSED;
            }
            const updateDatas = {
                status: newStatus,
                endedAt: now,
                trainerJoined: false,
                userJoined: false,
            };
            yield this._videoCallRepository.update(session._id, updateDatas);
            yield this._slotRepository.updateSlotStatus(session.slotId, newStatus === videoCallEnums_1.VideoCallStatus.COMPLETED ? { slotStatus: SlotEnums_1.SlotStatus.COMPLETED } : { slotStatus: SlotEnums_1.SlotStatus.MISSED });
            if (newStatus === videoCallEnums_1.VideoCallStatus.COMPLETED) {
                yield this.processPayout(session);
            }
            return { sessionId: session._id };
        });
    }
    processPayout(session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const membership = yield this._membershipRepository.findByUserId(session.userId);
                if (!membership) {
                    return;
                }
                const plan = yield this._subscriptionRepository.findById(membership.planId.toString());
                if (!plan) {
                    return;
                }
                const sessionRate = parseFloat((plan.price / (plan.durationMonths * 30)).toFixed(2));
                const trainerAmount = parseFloat((sessionRate * TRAINER_COMMISSION_PERCENT).toFixed(2));
                const platformAmount = parseFloat((sessionRate * PLATFORM_FEE_PERCENT).toFixed(2));
                yield this._walletRepository.credit(session.trainerId, 'trainer', trainerAmount, {
                    type: WalletTransactionType_1.WalletTransactionType.SESSION_COMMISSION,
                    amount: trainerAmount,
                    description: `Session commission (80%) for completed session`,
                    relatedId: session._id,
                });
                yield this._walletRepository.credit(config_1.CONFIG.ADMIN_ID, 'admin', platformAmount, {
                    type: WalletTransactionType_1.WalletTransactionType.PLATFORM_FEE,
                    amount: platformAmount,
                    description: `Platform fee (20%) for completed session`,
                    relatedId: session._id,
                });
                yield this._createNotification.execute({
                    recipientId: session.trainerId,
                    recipientRole: userEnums_1.UserRole.TRAINER,
                    type: NotificationEnums_1.NotificationType.SESSION_COMMISSION,
                    title: '💰 Session Payment Received!',
                    message: `₹${trainerAmount} has been credited to your wallet for completing a session.`,
                    relatedId: session._id,
                    isRead: false,
                });
            }
            catch (error) {
                console.error('Error processing session payout:', error);
            }
        });
    }
}
exports.EndVideoCallSessionUseCase = EndVideoCallSessionUseCase;
