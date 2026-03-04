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
exports.FindExpiredSessionUseCase = void 0;
const videoCallEnums_1 = require("../../../domain/enum/videoCallEnums");
const SlotEnums_1 = require("../../../domain/enum/SlotEnums");
class FindExpiredSessionUseCase {
    constructor(_videoCallRepository, _slotRepository) {
        this._videoCallRepository = _videoCallRepository;
        this._slotRepository = _slotRepository;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const expiredSessions = yield this._videoCallRepository.findAllExpiredSession(now);
            yield Promise.all(expiredSessions.map(session => {
                this._videoCallRepository.updateStatus(session.slotId, videoCallEnums_1.VideoCallStatus.MISSED);
                this._slotRepository.updateSlotStatus(session.slotId, { slotStatus: SlotEnums_1.SlotStatus.MISSED });
            }));
        });
    }
}
exports.FindExpiredSessionUseCase = FindExpiredSessionUseCase;
