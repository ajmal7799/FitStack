import { User } from "../../../../domain/entities/user/userEntities";
import { CreateUserDTO } from "../../../dto/auth/createUserDTO";
export interface ICreateUserUseCase {
  createUser(data: CreateUserDTO): Promise<User>;
}