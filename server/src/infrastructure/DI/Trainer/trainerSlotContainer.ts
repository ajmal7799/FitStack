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
import { SessionHistoryUseCase } from '../../../application/implementation/trainer/slot/sessionHistoryUseCase';
import { VideoCallRepository } from '../../repositories/videoCallRepository';
import { videoCallModel } from '../../database/models/videoCallModel';
import { SessionHistoryDetailsUseCase } from '../../../application/implementation/trainer/slot/sessionHistoryDetailsUseCase';
import { FeedbackRepository } from '../../repositories/feedbackRepository';
import { feedbackModel } from '../../database/models/feedbackModel';

// Respositories & Services
const userRepository = new UserRepository(userModel);
const slotRepository = new SlotRepository(slotModel);
const videoCallRepository = new VideoCallRepository(videoCallModel);
const storageService = new StorageService();
const feedbackRepository = new FeedbackRepository(feedbackModel);

// Use Cases
const createSlotUseCase = new CreateSlotUseCase(userRepository, slotRepository);
const getAllSlots = new GetAllSlotsUseCase(userRepository, slotRepository);
const deleteSlotUseCase = new DeleteSlotUseCase(slotRepository);
const recurringSlotUseCase = new RecurringSlotUseCase(userRepository, slotRepository);
const bookedSlotsUseCase = new BookedSlotsUseCase(videoCallRepository, userRepository);
const bookedSlotDetailsUseCase = new BookedSlotDetailsUseCase(videoCallRepository, userRepository, storageService);
const sessionHistoryUseCase = new SessionHistoryUseCase(videoCallRepository, userRepository, feedbackRepository);
const sessionHistoryDetailsUseCase = new SessionHistoryDetailsUseCase(
  videoCallRepository,
  userRepository,
  storageService,
  feedbackRepository
);

// Controllers
export const trainerSlotController = new TrainerSlotController(
  createSlotUseCase,
  getAllSlots,
  deleteSlotUseCase,
  recurringSlotUseCase,
  bookedSlotsUseCase,
  bookedSlotDetailsUseCase,
  sessionHistoryUseCase,
  sessionHistoryDetailsUseCase
);
