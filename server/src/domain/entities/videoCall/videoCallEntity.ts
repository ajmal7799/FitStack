import { VideoCallStatus } from '../../enum/videoCallEnums';
export interface VideoCall {
  _id: string;
  userId: string;
  trainerId: string;
  slotId: string;
  roomId: string;
  trainerJoined: boolean;
  userJoined: boolean;
  startedAt?: Date | null | undefined;
  endedAt?: Date | null | undefined;
  startTime: Date;
  endTime: Date;
  status: VideoCallStatus;
}
