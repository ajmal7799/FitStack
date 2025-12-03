import { UserTrainerController } from "../../../../interfaceAdapters/controller/user/userTrainerController";
import { VerificationRepository } from "../../../repositories/verificationRepository";
import { GetAllTrainerUseCase } from "../../../../application/implementation/user/Trainer/GetAllTrainerUseCase";
import { verificationModel } from "../../../database/models/verificationModel";

//repositories & services
const verificationRepository = new VerificationRepository(verificationModel);


// useCases
const getAllTrainerUseCase = new GetAllTrainerUseCase(verificationRepository);



// controllers
export const userTrainerController = new UserTrainerController(getAllTrainerUseCase);