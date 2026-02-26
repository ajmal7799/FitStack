import { IUserRepository } from '../../../../domain/interfaces/repositories/IUserRepository';
import { ISlotRepository } from '../../../../domain/interfaces/repositories/ISlotRepository';
import { IBookSlotUseCase } from '../../../useCase/user/booking/IBookSlotUseCase';
import { Slot } from '../../../../domain/entities/trainer/slot';
import { ConflictException, InvalidDataException, NotFoundException } from '../../../constants/exceptions';
import { USER_ERRORS } from '../../../../shared/constants/error';
import { IVideoCallRepository } from '../../../../domain/interfaces/repositories/IVideoCallRepository';
import { CreateVideoCallDTO } from '../../../dto/videoCall/videoCallDTO';
import crypto from "crypto";
import { VideoCallStatus } from '../../../../domain/enum/videoCallEnums';
import { VideoCallMapper } from '../../../mappers/videoCallMappers';
import { UserRole } from '../../../../domain/enum/userEnums';
import { NotificationType } from '../../../../domain/enum/NotificationEnums';
import { CreateNotification } from '../../notification/CreateNotification';



export class BookSlotUseCase implements IBookSlotUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _slotRepository: ISlotRepository,
        private _videoCallRepository: IVideoCallRepository,
        private _createNotification: CreateNotification
        ) {}

    async bookSlot(userId: string, slotId: string): Promise<Slot> {
        const user = await this._userRepository.findById(userId);

        if (!user) {
            throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
        }

        const slot = await this._slotRepository.findById(slotId);

        if (!slot) {
            throw new NotFoundException(USER_ERRORS.SLOT_NOT_FOUND);
        }

        if (new Date(slot.startTime) < new Date()) {
            throw new NotFoundException(USER_ERRORS.CONNOT_BOOK_SLOT_THAT_ALREADY_PASSED);
        }

        const dateStr = new Date(slot.startTime).toISOString().split('T')[0];
        const startOfDay = new Date(`${dateStr}T00:00:00.000Z`);
        const endOfDay = new Date(`${dateStr}T23:59:59.999Z`);

        const hasBookingToday = await this._slotRepository.checkUserBookingForDay(userId, startOfDay, endOfDay);

        if (hasBookingToday) {
            throw new InvalidDataException(USER_ERRORS.YOUR_HAVE_ALREADY_BOOKED_A_SEESSION_FOR_THIS_DAY);
        }

        const roomId = crypto.randomBytes(16).toString("hex");
        const updatedSlot = await this._slotRepository.updateSlotBooking(slotId, userId);

        if (!updatedSlot) {
            throw new ConflictException(USER_ERRORS.SLOT_NOT_FOUND);
        }
        
        const data : CreateVideoCallDTO = {
            _id: '',
            userId: userId,
            trainerId: slot.trainerId,
            slotId,
            roomId,
            trainerJoined: false,
            userJoined: false,
            startTime: slot.startTime,
            endTime: slot.endTime,
            status: VideoCallStatus.WAITING,
        }
        
        const videoCallData = VideoCallMapper.toEnitity(data);

        await this._videoCallRepository.save(videoCallData);

        await this._createNotification.execute({
            recipientId: slot.trainerId,
            recipientRole: UserRole.TRAINER,
            type: NotificationType.SLOT_BOOKED,
            title: "Slot Booked!",
            message: `${user.name} has booked a slot with you for ${new Date(slot.startTime).toLocaleString()}.`,
            relatedId: slot._id,
            isRead: false
        })

        return updatedSlot;
    }
}
