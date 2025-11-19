import { userModel } from "../../database/models/userModel";
import { UserRepository } from "../../repositories/userRepository";
import { GetAllTrainerUseCase } from "../../../application/implementation/admin/trainer/getAllTrainerUseCase";
import { AdminTrainerController } from "../../../interfaceAdapters/controller/admin/adminTrainerController";
import { UpdateTrainerStatusUseCase } from "../../../application/implementation/admin/trainer/updateTrainerUseCase";

//Repository & Service
const userRepository = new UserRepository(userModel);

//UseCase
const getAllTrainerUseCase = new GetAllTrainerUseCase(userRepository)
const updateTrainerStatus = new UpdateTrainerStatusUseCase(userRepository)

//controller
export const adminTrainerController = new AdminTrainerController(getAllTrainerUseCase,updateTrainerStatus)