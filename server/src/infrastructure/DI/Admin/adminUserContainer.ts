import { userModel } from '../../database/models/userModel';
import { UserRepository } from '../../repositories/userRepository';
import { GetAllUsersUseCase } from '../../../application/implementation/admin/user/getAllUsersUseCase';
import { AdminUserController } from '../../../interfaceAdapters/controller/admin/adminUserController';
import { UpdateUserStatusUseCase } from '../../../application/implementation/admin/user/updateUserStatusUseCase';

import { StorageService } from '../../services/Storage/storageService';

//Repository & Service
const userRepository = new UserRepository(userModel);
const storageSvc = new StorageService();

//UseCases
const getAllUserUseCase = new GetAllUsersUseCase(userRepository,storageSvc);
const updateUserStatus = new UpdateUserStatusUseCase(userRepository);

//Controllers
export const adminUserController = new AdminUserController(getAllUserUseCase,updateUserStatus);
