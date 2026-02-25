import { IEndVideoCallSessionUseCase } from '../../useCase/video/IEndVideoCallSessionUseCase';
import { IVideoCallRepository } from '../../../domain/interfaces/repositories/IVideoCallRepository';
import { VideoCallStatus } from '../../../domain/enum/videoCallEnums';
import { ISlotRepository } from '../../../domain/interfaces/repositories/ISlotRepository';
import { SlotStatus } from '../../../domain/enum/SlotEnums';
import { NotFoundException,AlreadyExisitingExecption } from '../../constants/exceptions';

export class EndVideoCallSessionUseCase implements IEndVideoCallSessionUseCase {
  constructor(private _videoCallRepository: IVideoCallRepository, private _slotRepository: ISlotRepository) {}
  async execute(slotId: string): Promise<{ sessionId: string }> {
    const session = await this._videoCallRepository.findById(slotId);

    if (!session) throw new NotFoundException("Session not found");

    if (session.status == VideoCallStatus.COMPLETED || session.status == VideoCallStatus.MISSED){
      throw new AlreadyExisitingExecption("Session already ended");
    }

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

    return { sessionId: session._id };
  }
}
