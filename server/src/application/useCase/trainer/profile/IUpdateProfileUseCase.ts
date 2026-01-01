import { UpdateTrainerProfileDTO, UpdateTrainerProfileResponseDTO } from "../../../dto/trainer/profile/updateTrainerProfileDTO";


export interface IUpdateTrainerProfileUseCase {
    updateTrainerProfile(id: string, data: UpdateTrainerProfileDTO): Promise<UpdateTrainerProfileResponseDTO>
}