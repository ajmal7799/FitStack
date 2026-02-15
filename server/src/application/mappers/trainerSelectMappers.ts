
import { TrainerSelection } from '../../domain/entities/trainer/trainerSelectionEntities';
import mongoose, { Mongoose } from 'mongoose';
import { ITrainerSelectModel } from '../../infrastructure/database/models/trainerSelectModel';
import { TrainerSelectionStatus } from '../../domain/enum/trainerSelectionEnums';


export class TrainerSelectMapper {
    static toMongooseDocument(selection: TrainerSelection) {
        return {
            _id: new mongoose.Types.ObjectId(selection.id),
            userId: selection.userId,
            trainerId: selection.trainerId,
            status: selection.status,
            selectedAt: selection.selectedAt,
        };
    }

    static fromMongooseDocument(doc: ITrainerSelectModel) : TrainerSelection {
        return {
            id: doc._id.toString(),
            userId: doc.userId.toString(),
            trainerId: doc.trainerId.toString(),
            status: doc.status as TrainerSelectionStatus,
            selectedAt: doc.selectedAt,
        };
    }

    static toEntity(userId: string, trainerId: string): TrainerSelection {
        return {
            id: new mongoose.Types.ObjectId().toString(),
            userId,
            trainerId,
            status: TrainerSelectionStatus.ACTIVE,
            selectedAt: new Date(),
        };
    }
}