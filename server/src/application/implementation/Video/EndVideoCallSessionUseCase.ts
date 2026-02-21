import { IEndVideoCallSessionUseCase } from '../../useCase/video/IEndVideoCallSessionUseCase';
import { IVideoCallRepository } from '../../../domain/interfaces/repositories/IVideoCallRepository';
import { VideoCallStatus } from '../../../domain/enum/videoCallEnums';
import { ISlotRepository } from '../../../domain/interfaces/repositories/ISlotRepository';
import { SlotStatus } from '../../../domain/enum/SlotEnums';

export class EndVideoCallSessionUseCase implements IEndVideoCallSessionUseCase {
  constructor(private _videoCallRepository: IVideoCallRepository, private _slotRepository: ISlotRepository) {}
  async execute(slotId: string): Promise<void> {
    const session = await this._videoCallRepository.findBySlotId(slotId);

    if (!session) return;

    if (session.status == VideoCallStatus.COMPLETED || session.status == VideoCallStatus.MISSED) return;

    const now = new Date();

    let newStatus: VideoCallStatus;
    if (session.startedAt) {
      newStatus = VideoCallStatus.COMPLETED;
    } else {
      newStatus = VideoCallStatus.MISSED;
    }

    const updateDatas = {
      status: newStatus,
      endedAt: now,
      trainerJoined: false,
      userJoined: false,
    };

    await this._videoCallRepository.update(session._id, updateDatas);
    await this._slotRepository.updateSlotStatus(session.slotId,  newStatus === VideoCallStatus.COMPLETED ? { slotStatus: SlotStatus.COMPLETED } : { slotStatus: SlotStatus.MISSED });

  }
}
