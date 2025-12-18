
import { UserProfileController } from "../../../interfaceAdapters/controller/user/userProfileController";
import { UserRepository } from "../../repositories/userRepository";
import { UserProfile } from "../../../domain/entities/user/userProfile";
import { StorageService } from "../../services/Storage/storageService";
import { userProfileModel } from "../../database/models/userProfileModel";
import { UserProfileRepository } from "../../repositories/userProfileRepository";
import { userModel } from "../../database/models/userModel";
import { CreateUserProfileUseCase } from "../../../application/implementation/user/CreateUserProfileUseCase";
import { GetProfileUseCase } from "../../../application/implementation/user/profile/GetProfileUseCase";
import { GetPersonalInfoUseCase } from "../../../application/implementation/user/profile/GetPersonalInfoUseCase";


// Repository & Service
const userProfileRepository = new UserProfileRepository(userProfileModel);
const userRepository = new UserRepository(userModel);
const storageSvc = new StorageService();


// useCases
const createUserProfileUseCase = new CreateUserProfileUseCase(
    userRepository,
    storageSvc,
    userProfileRepository
)

const getProfileUseCase = new GetProfileUseCase(userRepository);

const getProfileInfoUseCase = new GetPersonalInfoUseCase(userRepository, userProfileRepository, storageSvc);


// controllers
export const userProfileController = new UserProfileController(
    createUserProfileUseCase,
     getProfileUseCase,
      getProfileInfoUseCase
    );