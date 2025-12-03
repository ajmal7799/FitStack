import { userModel } from '../../database/models/userModel';
import { UserRepository } from '../../repositories/userRepository';
import { GetAllUsersUseCase } from '../../../application/implementation/admin/user/getAllUsersUseCase';
import { AdminUserController } from '../../../interfaceAdapters/controller/admin/adminUserController';
import { UpdateUserStatusUseCase } from '../../../application/implementation/admin/user/updateUserStatusUseCase';



//Repository & Service
const userRepository = new UserRepository(userModel);

//UseCases
const getAllUserUseCase = new GetAllUsersUseCase(userRepository);
const updateUserStatus = new UpdateUserStatusUseCase(userRepository);

//Controllers
export const adminUserController = new AdminUserController(getAllUserUseCase,updateUserStatus);
