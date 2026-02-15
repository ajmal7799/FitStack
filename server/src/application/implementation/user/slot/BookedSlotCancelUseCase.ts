import { IBookedSlotCancelUseCase } from "../../../useCase/user/booking/IBookedSlotCancelUseCase";
import { ISlotRepository } from "../../../../domain/interfaces/repositories/ISlotRepository";
import { NotFoundException, UnauthorizedException, ConflictException } from "../../../constants/exceptions";
import { SlotStatus } from "../../../../domain/enum/SlotEnums";

export class BookedSlotCancelUseCase implements IBookedSlotCancelUseCase {
    constructor(
        private _slotRepository: ISlotRepository,
    ) {}

    async cancelBookedSlot(userId: string, slotId: string, reason: string): Promise<void> {
        const slot = await this._slotRepository.findById(slotId);

        // 1. Check existence
        if (!slot) {
            throw new NotFoundException("Slot not found");
        }

        // 2. Security Check: Only the person who booked it can cancel it
        if (slot.bookedBy !== userId) {
            throw new UnauthorizedException("You cannot cancel someone else's booking");
        }

        // 3. Business Rule: Ensure slot hasn't started
        const now = new Date();
        if (new Date(slot.startTime) < now) {
            throw new ConflictException("Cannot cancel a slot that has already started or passed");
        }

        // 4. State Update
        await this._slotRepository.updateSlotStatus(slotId, {
            // isBooked: false,
            // Use type assertion if your Slot entity expects a string
            slotStatus: SlotStatus.CANCELLED,   
            cancellationReason: reason,
        });
    }
}