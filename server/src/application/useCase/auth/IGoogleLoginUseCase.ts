import { IGoogleLoginRequestDTO,IGoogleLoginResponseDTO } from '../../dto/auth/googleAuthDTO';

export interface IGoogleLoginUseCase {
  execute(dto: IGoogleLoginRequestDTO): Promise<IGoogleLoginResponseDTO>;
}