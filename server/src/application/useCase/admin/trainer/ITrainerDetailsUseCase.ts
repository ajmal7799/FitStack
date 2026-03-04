import { TrainerDetailsAdminDTO } from '../../../dto/admin/subscription/TrainerDetailsDTO';
export interface ITrainerDetailsUseCase {
    getTrainerDetails(trainerId: string): Promise<TrainerDetailsAdminDTO>
}