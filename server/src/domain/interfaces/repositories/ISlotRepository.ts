import { IBaseRepository } from './IBaseRepository';
import { Slot } from '../../entities/trainer/slot';
export interface ISlotRepository extends IBaseRepository<Slot> {
    isOverLapping(trainerId: string, startTime: string, endTime: string): Promise<boolean>
    findAllSlots(trainerId: string, skip: number, limit: number, status?: string): Promise<Slot[]>
    countSlots(trainerId: string, status?: string): Promise<number>
    findAllAvailableSlots(trainerId: string, date: string): Promise<Slot[]>
    checkUserBookingForDay(userId: string, startTime: Date, endTime: Date): Promise<boolean>
    updateSlotBooking(slotId: string, userId: string): Promise<Slot | null>
    deleteById(slotId: string): Promise<void>
    createMany(slots: Partial<Slot>[]): Promise<Slot[]>
    findAllBookedSlotsByUserId(userId: string, skip?: number, limit?: number): Promise<Slot[]>
    countBookedSlotsByUserId(userId: string): Promise<number>
    updateSlotStatus(slotId: string, data: Partial<Slot>): Promise<void>;
    findTrainerSessions(trainerId: string, skip: number, limit: number): Promise<Slot[]>
    countTrainerSessions(trainerId: string): Promise<number>

}