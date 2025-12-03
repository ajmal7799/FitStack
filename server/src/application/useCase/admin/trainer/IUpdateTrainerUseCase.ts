import { UserStatus } from '../../../../domain/enum/userEnums';
import { UserDTO } from '../../../dto/user/userDTO';

export interface IUpdateTrainerStatusUseCase {
   updateTrainerStatus(userId: string, currentStatus: UserStatus): Promise<{ user: UserDTO }>; 
}