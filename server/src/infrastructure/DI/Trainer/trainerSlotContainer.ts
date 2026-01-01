import { TrainerSlotController } from "../../../interfaceAdapters/controller/trainer/trainerSlotController";
import { CreateSlotUseCase } from "../../../application/implementation/trainer/slot/createSlotUseCase";
import { UserRepository } from '../../repositories/userRepository';
import { userModel } from '../../database/models/userModel';
import { SlotRepository } from "../../repositories/slotRepository";
import { slotModel } from "../../database/models/slotModel";
import { GetAllSlotsUseCase } from "../../../application/implementation/trainer/slot/getAllSlotsUseCase";
import { DeleteSlotUseCase } from "../../../application/implementation/trainer/slot/deleteSlotUseCase";

// Respositories & Services
const userRepository = new UserRepository(userModel); 
const slotRepository = new SlotRepository(slotModel);

// Use Cases
const createSlotUseCase = new CreateSlotUseCase(userRepository, slotRepository);
const getAllSlots = new GetAllSlotsUseCase(userRepository, slotRepository);
const deleteSlotUseCase = new DeleteSlotUseCase(slotRepository);

// Controllers
export const trainerSlotController = new TrainerSlotController( createSlotUseCase, getAllSlots, deleteSlotUseCase );