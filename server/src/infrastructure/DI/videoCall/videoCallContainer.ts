import { VideoCallRepository } from '../../repositories/videoCallRepository';
import { videoCallModel } from '../../database/models/videoCallModel';
import { UserRepository } from '../../repositories/userRepository';
import { userModel } from '../../database/models/userModel';
import { VideoCallController } from '../../../interfaceAdapters/controller/video/videoCallController';
import { JoinSessionUseCase } from '../../../application/implementation/Video/JoinSessionUseCase';
import { SlotRepository } from '../../repositories/slotRepository';
import { slotModel } from '../../database/models/slotModel';
import { FindExpiredSessionUseCase } from '../../../application/implementation/Video/FindExpiredSessionUseCase';


// Repostitory & Services
const videoCallRepository = new VideoCallRepository(videoCallModel);
const userRepository = new UserRepository(userModel);
const slotRepository = new SlotRepository(slotModel);


// useCases
const joinSessionUseCase = new JoinSessionUseCase( slotRepository ,videoCallRepository);
export const findExpiredSessionUseCase =  new FindExpiredSessionUseCase(videoCallRepository, slotRepository); 




//controllers
export const videoCallController = new VideoCallController(
    joinSessionUseCase
)