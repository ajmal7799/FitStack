import { VideoCallStatus } from '../../../domain/enum/videoCallEnums';
import { UserRole } from '../../../domain/enum/userEnums';
export interface CreateVideoCallDTO {
  _id: string;
  userId: string;
  trainerId: string;
  slotId: string;
  roomId: string;

  trainerJoined: boolean;
  userJoined: boolean;
  startedAt?: Date | null;
  endedAt?: Date | null;

  startTime: Date;
  endTime: Date;
  status: VideoCallStatus;

   cancellationReason?: string | null;
    cancelledAt?: Date | null;
    cancelledBy?:   UserRole | null;
}
