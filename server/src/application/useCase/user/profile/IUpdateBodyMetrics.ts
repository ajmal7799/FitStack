import { updateUserBodyMetricsRequestDTO,updateUserBodyMetricsResponseDTO } from '../../../dto/user/profile/updateUserBodyMetricsDTO';
import { UserProfile } from '../../../../domain/entities/user/userProfile';
export interface IUpdateBodyMetricsUseCase {
    execute(userId: string, data: updateUserBodyMetricsRequestDTO): Promise<UserProfile | null>;
}