import { IFindExpiredSessionUseCase } from "../../useCase/video/IFindExpiredSessionUseCase";
import { IVideoCallRepository } from "../../../domain/interfaces/repositories/IVideoCallRepository";
import { VideoCallStatus } from "../../../domain/enum/videoCallEnums";
import { ISlotRepository } from "../../../domain/interfaces/repositories/ISlotRepository";
import { SlotStatus } from "../../../domain/enum/SlotEnums";

export class FindExpiredSessionUseCase implements IFindExpiredSessionUseCase {
    constructor(
        private _videoCallRepository: IVideoCallRepository,
        private _slotRepository: ISlotRepository

    ) {}

    async execute(): Promise<void> {
        const now = new Date();
        const expiredSessions = await this._videoCallRepository.findAllExpiredSession(now);

        await Promise.all(
        expiredSessions.map(session => {
            this._videoCallRepository.updateStatus(session.slotId, VideoCallStatus.MISSED);
            this._slotRepository.updateSlotStatus(session.slotId,  { slotStatus: SlotStatus.MISSED })
    })
    );
        
    }
}