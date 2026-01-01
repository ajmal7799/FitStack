"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProfileController = void 0;
const userProfileController_1 = require("../../../interfaceAdapters/controller/user/userProfileController");
const userRepository_1 = require("../../repositories/userRepository");
const storageService_1 = require("../../services/Storage/storageService");
const userProfileModel_1 = require("../../database/models/userProfileModel");
const userProfileRepository_1 = require("../../repositories/userProfileRepository");
const userModel_1 = require("../../database/models/userModel");
const CreateUserProfileUseCase_1 = require("../../../application/implementation/user/CreateUserProfileUseCase");
const GetUserProfileUseCase_1 = require("../../../application/implementation/user/profile/GetUserProfileUseCase");
const GetUserBodyMetricsUseCase_1 = require("../../../application/implementation/user/profile/GetUserBodyMetricsUseCase");
const UpdateUserProfileUseCase_1 = require("../../../application/implementation/user/profile/UpdateUserProfileUseCase");
const UpdateUserBodyMetricsUseCase_1 = require("../../../application/implementation/user/profile/UpdateUserBodyMetricsUseCase");
// Repository & Service
const userProfileRepository = new userProfileRepository_1.UserProfileRepository(userProfileModel_1.userProfileModel);
const userRepository = new userRepository_1.UserRepository(userModel_1.userModel);
const storageSvc = new storageService_1.StorageService();
// useCases
const createUserProfileUseCase = new CreateUserProfileUseCase_1.CreateUserProfileUseCase(userRepository, storageSvc, userProfileRepository);
const getProfileUseCase = new GetUserProfileUseCase_1.GetProfileUseCase(userRepository, storageSvc);
const getProfileInfoUseCase = new GetUserBodyMetricsUseCase_1.GetPersonalInfoUseCase(userRepository, userProfileRepository, storageSvc);
const updateUserProfileUseCase = new UpdateUserProfileUseCase_1.UpdateUserProfileUseCase(userRepository, storageSvc);
const updateUserBodyMetricsUseCase = new UpdateUserBodyMetricsUseCase_1.UpdateUserBodyMetricsUseCase(userProfileRepository);
// controllers
exports.userProfileController = new userProfileController_1.UserProfileController(createUserProfileUseCase, getProfileUseCase, getProfileInfoUseCase, updateUserProfileUseCase, updateUserBodyMetricsUseCase);
