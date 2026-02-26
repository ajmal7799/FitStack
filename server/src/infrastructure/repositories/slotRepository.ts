import { ISlotRepository } from '../../domain/interfaces/repositories/ISlotRepository';
import { Slot } from '../../domain/entities/trainer/slot';
import { SlotMapper } from '../../application/mappers/slotMappers';
import { BaseRepository } from './baseRepository';
import { ISlotModel } from '../database/models/slotModel';
import { Model } from 'mongoose';
import { FilterQuery, SortOrder } from 'mongoose';
import { ConflictException } from '../../application/constants/exceptions';
import { TRAINER_ERRORS } from '../../shared/constants/error';
import { create } from 'domain';
import { SlotStatus } from '../../domain/enum/SlotEnums';

export class SlotRepository extends BaseRepository<Slot, ISlotModel> implements ISlotRepository {
  constructor(protected _model: Model<ISlotModel>) {
    super(_model, SlotMapper);
  }

  async isOverLapping(trainerId: string, startTime: string, endTime: string): Promise<boolean> {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const existingOverlap = await this._model.findOne({
      trainerId: trainerId,
      $and: [{ startTime: { $lt: end } }, { endTime: { $gt: start } }],
    });

    return existingOverlap ? true : false;
  }

  async findAllSlots(trainerId: string, skip: number, limit: number, status?: string): Promise<Slot[]> {
    const now = new Date();
    const query: FilterQuery<ISlotModel> = { trainerId };
    let sort: { [key: string]: SortOrder } = { startTime: -1 };

    switch (status) {
      case 'upcoming':
        query.startTime = { $gt: now };
        sort = { startTime: 1 };

        break;
      case 'booked':
        query.isBooked = true;
        query.startTime = { $gt: now }; // Usually "Booked" refers to upcoming appointments
        break;
      case 'past':
        query.startTime = { $lt: now };
        sort = { startTime: -1 };
        break;
      case 'all':
      default:
        sort = { createdAt: -1 }; // Newest dates (furthest in future) appear first
        break;
    }

    const slots = await this._model.find(query).sort(sort).skip(skip).limit(limit);
    return slots.map(slot => SlotMapper.fromMongooseDocument(slot));
  }

  async countSlots(trainerId: string, status?: string): Promise<number> {
    const now = new Date();
    const query: FilterQuery<ISlotModel> = { trainerId };
    switch (status) {
      case 'upcoming':
        query.startTime = { $gt: now };
        break;
      case 'booked':
        query.isBooked = true;
        query.startTime = { $gt: now };
        break;
      case 'past':
        query.startTime = { $lt: now };
        break;
      case 'all':
      default:
        // No additional filters for 'all'
        break;
    }
    return await this._model.countDocuments(query);
  }
  async findAllAvailableSlots(trainerId: string, date: string): Promise<Slot[]> {
    const OFFSET_HOURS = 5.5; // IST = UTC+5:30 — change to your timezone
    const OFFSET_MS = OFFSET_HOURS * 60 * 60 * 1000;

    // Convert local midnight to UTC
    // "2026-01-26" local 00:00 IST = "2026-01-25T18:30:00.000Z"
    const startOfDay = new Date(new Date(`${date}T00:00:00.000Z`).getTime() - OFFSET_MS);
    const endOfDay = new Date(new Date(`${date}T23:59:59.999Z`).getTime() - OFFSET_MS);

    const now = new Date();

    // Use endTime > now so slots that already started but haven't ended are still shown
    const isToday = now >= startOfDay && now <= endOfDay;

    const slots = await this._model
      .find({
        trainerId,
        slotStatus: { $in: [SlotStatus.AVAILABLE, SlotStatus.CANCELLED] },
        startTime: { $gte: startOfDay, $lte: endOfDay },
        ...(isToday && { endTime: { $gt: now } }), // only filter past slots when searching today
      })
      .sort({ startTime: 1 });

    return slots.map(slot => SlotMapper.fromMongooseDocument(slot));
  }

  async checkUserBookingForDay(userId: string, startTime: Date, endTime: Date): Promise<boolean> {
    const count = await this._model.countDocuments({
      bookedBy: userId,
      slotStatus: SlotStatus.BOOKED,

      startTime: {
        $gte: new Date(startTime),
        $lte: new Date(endTime),
      },
    });
    return count > 0;
  }

  async updateSlotBooking(slotId: string, userId: string): Promise<Slot | null> {
    const updateDoc = await this._model.findOneAndUpdate(
      {
        _id: slotId,
      },
      {
        $set: {
          isBooked: true,
          bookedBy: userId,
          slotStatus: SlotStatus.BOOKED,
          cancellationReason: null,
        },
      },
      {
        new: true,
      }
    );
    if (!updateDoc) {
      return null;
    }
    return SlotMapper.fromMongooseDocument(updateDoc);
  }

  async deleteById(slotId: string): Promise<void> {
    const result = await this._model.deleteOne({ _id: slotId, isBooked: false });
    if (!result) {
      throw new ConflictException(TRAINER_ERRORS.COULD_NOT_DELETE_SLOT);
    }
  }

  async createMany(slots: Partial<Slot>[]): Promise<Slot[]> {
    const createdDocs = await this._model.insertMany(slots);
    return createdDocs.map(doc => {
      const plainDoc = doc.toObject() as unknown as ISlotModel;
      return SlotMapper.fromMongooseDocument(plainDoc);
    });
  }

  async findAllBookedSlotsByUserId(userId: string, skip: number = 0, limit: number = 5): Promise<Slot[]> {
    const query: FilterQuery<ISlotModel> = {
      bookedBy: userId,
      // startTime: {$gt:new Date() }
      // isBooked: true,
      // slotStatus: SlotStatus.BOOKED,
    };

    const slots = await this._model.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

    return slots.map(slot => SlotMapper.fromMongooseDocument(slot));
  }

  async countBookedSlotsByUserId(userId: string): Promise<number> {
    return await this._model.countDocuments({
      bookedBy: userId,
      // slotStatus: SlotStatus.BOOKED,
      // isBooked: true
    });
  }

  async updateSlotStatus(slotId: string, data: Partial<Slot>): Promise<void> {
    await this._model.findByIdAndUpdate(slotId, {
      $set: {
        ...data,
      },
    });
  }

  async findTrainerSessions(trainerId: string, skip = 0, limit = 5): Promise<Slot[]> {
    const query: FilterQuery<ISlotModel> = {
      trainerId: trainerId,
      isBooked: true,
      // slotStatus: SlotStatus.BOOKED ,
      endTime: {
        $gte: new Date(),
      },
    };
    const slots = await this._model.find(query).sort({ startTime: 1 }).skip(skip).limit(limit);

    return slots.map(slot => SlotMapper.fromMongooseDocument(slot));
  }

  async countTrainerSessions(trainerId: string): Promise<number> {
    return await this._model.countDocuments({ trainerId, isBooked: true, endTime: { $gte: new Date() } });
  }
}
