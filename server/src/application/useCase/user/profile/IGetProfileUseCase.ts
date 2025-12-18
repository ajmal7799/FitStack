import { LoginUserDTO } from "../../../dto/auth/LoginUserDTO";

export interface IGetProfileUseCase {
    execute(userId: string): Promise<LoginUserDTO>;
}