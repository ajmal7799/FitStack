import { IBookedSlotCancelUseCase } from "../../../useCase/user/booking/IBookedSlotCancelUseCase";
import { ISlotRepository } from "../../../../domain/interfaces/repositories/ISlotRepository";
import { 
    NotFoundException, 
    UnauthorizedException, 
    ConflictException, 
    DataMissingExecption 
} from "../../../constants/exceptions";
import { SlotStatus } from "../../../../domain/enum/SlotEnums";
import { IVideoCallRepository } from "../../../../domain/interfaces/repositories/IVideoCallRepository";
import { VideoCallStatus } from "../../../../domain/enum/videoCallEnums";
import { UserRole } from "../../../../domain/enum/userEnums";

export class BookedSlotCancelUseCase implements IBookedSlotCancelUseCase {
    constructor(
        private _slotRepository: ISlotRepository,
        private _videoCallRepository: IVideoCallRepository
    ) {}

    async cancelBookedSlot(userId: string, slotId: string, reason: string, role: UserRole): Promise<void> {            

        const session = await this._videoCallRepository.findById(slotId);
        

        // 2. Check existence
        if (!session) {
            throw new NotFoundException("Session not found for this slot");
        }
        console.log('session', session.status);

        // 3. Status Validation: Only 'WAITING' sessions can be cancelled
        if (session.status !== VideoCallStatus.WAITING) {
            throw new ConflictException(`Cannot cancel session with status: ${session.status}`);
        }

        // 4. Security Check: Role-based authorization using .toString() for ObjectIds
        if (role === UserRole.USER && session.userId.toString() !== userId) {
            throw new UnauthorizedException("You cannot cancel someone else's booking");
        }

        if (role === UserRole.TRAINER && session.trainerId.toString() !== userId) {
            throw new UnauthorizedException("You are not the assigned trainer for this session");
        }

        // 5. Business Rule: Ensure session hasn't started
        const now = new Date();
        if (new Date(session.startTime) < now) {
            throw new ConflictException("Cannot cancel a session that has already started or passed");
        }

        await this._videoCallRepository.update(session._id, {
            status: VideoCallStatus.CANCELLED,
            cancellationReason: reason.trim(),
            cancelledAt: new Date(),
            cancelledBy: role
        });

        // 7. Re-open the slot
        await this._slotRepository.updateSlotStatus(session.slotId, {
            isBooked: false,
            bookedBy: null,
            slotStatus: SlotStatus.AVAILABLE, 
        });
    }
}