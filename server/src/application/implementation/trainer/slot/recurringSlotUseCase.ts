import { CreateSlotDTO } from '../../../dto/trainer/slot/createSlotDTO';
import { RecurringSlotDTO } from '../../../dto/trainer/slot/recurringDTO';
import { IRecurringSlotUseCase } from '../../../useCase/trainer/slot/IRecurringSlotUseCase';
import { IUserRepository } from '../../../../domain/interfaces/repositories/IUserRepository';
import { ISlotRepository } from '../../../../domain/interfaces/repositories/ISlotRepository';
import { NotFoundException } from '../../../constants/exceptions';
import { TRAINER_ERRORS } from '../../../../shared/constants/error';
import { Slot } from '../../../../domain/entities/trainer/slot';
// import {}


export class RecurringSlotUseCase implements IRecurringSlotUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _slotRepository: ISlotRepository
  ) {}

  async createRecurringSlot(trainerId: string, data: RecurringSlotDTO): Promise<Slot[]> {
    // 1. Verify Trainer
    const trainer = await this._userRepository.findById(trainerId);
    if (!trainer) {
      throw new NotFoundException(TRAINER_ERRORS.TRAINER_NOT_FOUND);
    }

    const { startDate, endDate, startTime, weekdays } = data;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const [hours, minutes] = startTime.split(":").map(Number);
    
    const slotsToCreate: Partial<Slot>[] = [];

    // 2. Loop through each date in the range
    let current = new Date(start);
    while (current <= end) {
      const dayName = current
        .toLocaleDateString("en-US", { weekday: "short" })
        .toUpperCase(); 

      // 3. Match against selected weekdays
      if (weekdays.includes(dayName)) {
        const slotStartTime = new Date(current);
        slotStartTime.setHours(hours, minutes, 0, 0);

        const slotEndTime = new Date(slotStartTime);
        slotEndTime.setMinutes(slotStartTime.getMinutes() + 60); // 60 min fixed duration

        // 4. Overlap Check (using your query)
        const isOverlapping = await this._slotRepository.isOverLapping(
          trainerId,
          slotStartTime.toISOString(),
          slotEndTime.toISOString()
        );

        if (isOverlapping) {
          throw new Error(
            `Conflict: Slot already exists on ${slotStartTime.toDateString()} at ${startTime}`
          );
        }

        // 5. Build slot object for insertion
        slotsToCreate.push({
          trainerId,
          startTime: slotStartTime,
          endTime: slotEndTime,
          isBooked: false,
          bookedBy: null,
        });
      }

      // Move to next day
      current.setDate(current.getDate() + 1);
    }

    if (slotsToCreate.length === 0) {
      throw new Error("No slots generated for the selected date range and weekdays.");
    }

    // 6. Bulk Insert and Map
    return await this._slotRepository.createMany(slotsToCreate);
  }
}
