import { IJoinSessionUseCase } from "../../useCase/video/IJoinSessionUseCase";
import { NotFoundException,ForbiddenException } from "../../constants/exceptions";
import { ISlotRepository } from "../../../domain/interfaces/repositories/ISlotRepository";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { SlotStatus } from "../../../domain/enum/SlotEnums";
import { VideoCallStatus } from "../../../domain/enum/videoCallEnums";
import { VideoCall } from "../../../domain/entities/videoCall/videoCallEntity";
import { IVideoCallRepository } from "../../../domain/interfaces/repositories/IVideoCallRepository";


export class JoinSessionUseCase implements IJoinSessionUseCase {
    constructor(
        private _slotRepository: ISlotRepository,
        private _videoCallRepository: IVideoCallRepository
    ) {}
  async execute(userId: string,slotId: string): Promise<{roomId: string}> {

        const slot = await this._slotRepository.findById(slotId);
        if (!slot || slot.slotStatus !== SlotStatus.BOOKED) {
            throw new NotFoundException("Valid booked slot not found.");
        }

        // 2. Validate Time Window (Allow joining 5 mins early, for example)
        const now = new Date();
        const bufferMillis = 5 * 60 * 1000; 
        if (now.getTime() < new Date(slot.startTime).getTime() - bufferMillis) {
            throw new ForbiddenException("Session has not started yet.");
        }
        if (now.getTime() > new Date(slot.endTime).getTime()) {
            throw new ForbiddenException("This session has already ended.");
        }

        // 3. Find the Video Session
        const session = await this._videoCallRepository.findBySlotId(slotId);
        if (!session) throw new NotFoundException("Video session record missing.");

        // 4. Update Join Flags
        const isTrainer = userId === slot.trainerId;
        const isUser = userId === slot.bookedBy;

        if (!isTrainer && !isUser) {
            throw new ForbiddenException("You are not authorized to join this session.");
        }

        const updateData: Partial<VideoCall> = {};
        if (isTrainer) updateData.trainerJoined = true;
        if (isUser) updateData.userJoined = true;

        // 5. Check if session should become ACTIVE
        // Logic: If the other person is already there, or joining now makes both present
        const willBothBePresent = 
            (isTrainer && session.userJoined) || 
            (isUser && session.trainerJoined) || 
            (session.userJoined && session.trainerJoined);

        if (willBothBePresent && session.status === VideoCallStatus.WAITING) {  
            updateData.status = VideoCallStatus.ACTIVE;
            updateData.startedAt = new Date();
        }

        await this._videoCallRepository.update(session._id, updateData);

        return { roomId: session.roomId };
        
    }
}