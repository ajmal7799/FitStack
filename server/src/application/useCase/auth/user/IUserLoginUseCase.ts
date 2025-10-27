import { LoginUserDTO } from "../../../dto/auth/LoginUserDTO";
export interface IUserLoginUseCase {
    userLogin(email:string, password:string): Promise<LoginUserDTO> 
}