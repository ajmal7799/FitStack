import { UserBookingSlotController } from "../../../interfaceAdapters/controller/user/userBookingSlotController";
import { UserRepository } from "../../repositories/userRepository";
import { TrainerRepository } from "../../repositories/trainerRepository";
import { TrainerSelectRepository } from "../../repositories/trainerSelectRepository";
import { userModel } from "../../database/models/userModel";
import { trainerModel } from "../../database/models/trainerModel";
import { trainerSelectModel } from "../../database/models/trainerSelectModel";
import { GetAllAvailableSlotUseCase } from "../../../application/implementation/user/slot/GetAllAvailableSlotUseCase";
import { SlotRepository } from "../../repositories/slotRepository";
import { slotModel } from "../../database/models/slotModel";
import { BookSlotUseCase } from "../../../application/implementation/user/slot/BookSlotUseCase";

// Repository & Service
const userRepository = new UserRepository(userModel);
const trainerRepository = new TrainerRepository(trainerModel);
const trainerSelectRepository = new TrainerSelectRepository(trainerSelectModel);
const slotRepository = new SlotRepository(slotModel);

// UseCases
const getAllAvailableSlotUseCase = new GetAllAvailableSlotUseCase(slotRepository, userRepository, trainerSelectRepository);
const bookSlotUseCase = new BookSlotUseCase(userRepository, slotRepository);

// Controllers
export const userBookingSlotController = new UserBookingSlotController(getAllAvailableSlotUseCase, bookSlotUseCase);

