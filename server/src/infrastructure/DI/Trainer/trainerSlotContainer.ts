import { TrainerSlotController } from '../../../interfaceAdapters/controller/trainer/trainerSlotController';
import { CreateSlotUseCase } from '../../../application/implementation/trainer/slot/createSlotUseCase';
import { UserRepository } from '../../repositories/userRepository';
import { userModel } from '../../database/models/userModel';
import { SlotRepository } from '../../repositories/slotRepository';
import { slotModel } from '../../database/models/slotModel';
import { GetAllSlotsUseCase } from '../../../application/implementation/trainer/slot/getAllSlotsUseCase';
import { DeleteSlotUseCase } from '../../../application/implementation/trainer/slot/deleteSlotUseCase';
import { RecurringSlotUseCase } from '../../../application/implementation/trainer/slot/recurringSlotUseCase';
import { BookedSlotsUseCase } from '../../../application/implementation/trainer/slot/getBookedSlotUseCase';
import { BookedSlotDetailsUseCase } from '../../../application/implementation/trainer/slot/bookedSlotDetailsUseCase';
import { StorageService } from '../../services/Storage/storageService';

// Respositories & Services
const userRepository = new UserRepository(userModel);
const slotRepository = new SlotRepository(slotModel);
const storageService = new StorageService();

// Use Cases
const createSlotUseCase = new CreateSlotUseCase(userRepository, slotRepository);
const getAllSlots = new GetAllSlotsUseCase(userRepository, slotRepository);
const deleteSlotUseCase = new DeleteSlotUseCase(slotRepository);
const recurringSlotUseCase = new RecurringSlotUseCase(userRepository, slotRepository);
const bookedSlotsUseCase = new BookedSlotsUseCase(slotRepository, userRepository);
const bookedSlotDetailsUseCase = new BookedSlotDetailsUseCase(slotRepository, userRepository, storageService);

// Controllers
export const trainerSlotController = new TrainerSlotController(
  createSlotUseCase,
  getAllSlots,
  deleteSlotUseCase,
  recurringSlotUseCase,
  bookedSlotsUseCase,
  bookedSlotDetailsUseCase
);
