"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUserController = void 0;
const userModel_1 = require("../../database/models/userModel");
const userRepository_1 = require("../../repositories/userRepository");
const getAllUsersUseCase_1 = require("../../../application/implementation/admin/user/getAllUsersUseCase");
const adminUserController_1 = require("../../../interfaceAdapters/controller/admin/adminUserController");
const updateUserStatusUseCase_1 = require("../../../application/implementation/admin/user/updateUserStatusUseCase");
const storageService_1 = require("../../services/Storage/storageService");
//Repository & Service
const userRepository = new userRepository_1.UserRepository(userModel_1.userModel);
const storageSvc = new storageService_1.StorageService();
//UseCases
const getAllUserUseCase = new getAllUsersUseCase_1.GetAllUsersUseCase(userRepository, storageSvc);
const updateUserStatus = new updateUserStatusUseCase_1.UpdateUserStatusUseCase(userRepository);
//Controllers
exports.adminUserController = new adminUserController_1.AdminUserController(getAllUserUseCase, updateUserStatus);
