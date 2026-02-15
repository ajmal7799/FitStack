import { CreateSlotDTO } from '../../../dto/trainer/slot/createSlotDTO';

export interface ICreateSlotUseCase {
    createSlot(trainerId: string, startTime: string): Promise<CreateSlotDTO>;
}