import { UserBookingSlotController } from '../../../interfaceAdapters/controller/user/userBookingSlotController';
import { UserRepository } from '../../repositories/userRepository';
import { TrainerRepository } from '../../repositories/trainerRepository';
import { TrainerSelectRepository } from '../../repositories/trainerSelectRepository';
import { userModel } from '../../database/models/userModel';
import { trainerModel } from '../../database/models/trainerModel';
import { trainerSelectModel } from '../../database/models/trainerSelectModel';
import { GetAllAvailableSlotUseCase } from '../../../application/implementation/user/slot/GetAllAvailableSlotUseCase';
import { SlotRepository } from '../../repositories/slotRepository';
import { slotModel } from '../../database/models/slotModel';
import { BookSlotUseCase } from '../../../application/implementation/user/slot/BookSlotUseCase';
import { BookedSlotUseCase } from '../../../application/implementation/user/slot/BookedSlotUseCase';
import { BookedSlotDetailsUseCase } from '../../../application/implementation/user/slot/BookedSlotDetailsUseCase';
import { StorageService } from '../../services/Storage/storageService';
import { BookedSlotCancelUseCase } from '../../../application/implementation/user/slot/BookedSlotCancelUseCase';
import { VideoCallRepository } from '../../repositories/videoCallRepository';
import { videoCallModel } from '../../database/models/videoCallModel';
import { SessionHistoryUseCase } from '../../../application/implementation/user/slot/SessionHistoryUseCase';
import { SessionHistoryDetailsUseCase } from '../../../application/implementation/user/slot/SessionHistoryDetailsUseCase';
import { FeedbackRepository } from '../../repositories/feedbackRepository';
import { feedbackModel } from '../../database/models/feedbackModel';


// Repository & Service
const userRepository = new UserRepository(userModel);
const trainerRepository = new TrainerRepository(trainerModel);
const trainerSelectRepository = new TrainerSelectRepository(trainerSelectModel);
const slotRepository = new SlotRepository(slotModel);
const storageSvc = new StorageService();
const videoCallRepository = new VideoCallRepository(videoCallModel);
const feedbackRepository = new FeedbackRepository(feedbackModel);

// UseCases
const getAllAvailableSlotUseCase = new GetAllAvailableSlotUseCase(slotRepository, userRepository, trainerSelectRepository);
const bookSlotUseCase = new BookSlotUseCase(userRepository, slotRepository, videoCallRepository);
const bookedSlotUseCase = new BookedSlotUseCase(userRepository, trainerSelectRepository, videoCallRepository);
const bookedSlotDetailsUseCase = new BookedSlotDetailsUseCase(userRepository, videoCallRepository, storageSvc, feedbackRepository);
const bookedSlotCancelUseCase = new BookedSlotCancelUseCase(slotRepository, videoCallRepository);
const sessionHistoryUseCase = new SessionHistoryUseCase(videoCallRepository, userRepository, trainerSelectRepository, feedbackRepository);
const sessionHistoryDetailsUseCase = new SessionHistoryDetailsUseCase(videoCallRepository, userRepository, storageSvc, feedbackRepository);


// Controllers
export const userBookingSlotController = new UserBookingSlotController(getAllAvailableSlotUseCase, bookSlotUseCase, bookedSlotUseCase, bookedSlotDetailsUseCase, bookedSlotCancelUseCase, sessionHistoryUseCase, sessionHistoryDetailsUseCase);

