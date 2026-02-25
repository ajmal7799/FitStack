import { Trainer } from '../../domain/entities/trainer/trainerEntities';
import mongoose, { Mongoose } from 'mongoose';
import { ITrainerModel } from '../../infrastructure/database/models/trainerModel';
import { TrainerVerification } from '../../domain/entities/trainer/verification';
import { VerificationStatus } from '../../domain/enum/verificationStatus';
import { TrainerProfileDTO } from '../dto/trainer/profile/trainerProfileDTO';
import { TrainerDetailsResponseDTO } from '../dto/user/trainersDTO';
import { User } from '../../domain/entities/user/userEntities';

export class TrainerMapper {
    static toMongooseDocment(trainer: Trainer) {
        return {
            _id: new mongoose.Types.ObjectId(trainer.id),
            trainerId: trainer.trainerId,
            qualification: trainer.qualification,
            specialisation: trainer.specialisation,
            experience: trainer.experience,
            about: trainer.about,
            isVerified: trainer.isVerified,
            ratingCount: trainer.ratingCount,
            ratingSum: trainer.ratingSum,
            averageRating: trainer.averageRating

        };
    }

    static fromMongooseDocument(doc: ITrainerModel) : Trainer {
        return {
            id: doc._id.toString(),
            trainerId: doc.trainerId,
            qualification: doc.qualification,
            specialisation: doc.specialisation, 
            experience: doc.experience,
            about: doc.about,
            isVerified: doc.isVerified,
            ratingCount: doc.ratingCount,
            ratingSum: doc.ratingSum,
            averageRating: doc.averageRating
        };
    }

    static toTrainerProfileDTO(
        trainer: Trainer,
        user: { name: string; email: string; phone?: string, profileImage?: string },
        verification?: TrainerVerification | null,
    ): TrainerProfileDTO {
        return {
            name: user.name,
            email: user.email,
            phone: user.phone ?? undefined,
            profileImage: user.profileImage ?? undefined,
            about: trainer.about ?? undefined,
            experience: trainer.experience,
            qualification: trainer.qualification ?? undefined,
            specialisation: trainer.specialisation ?? undefined,
            verificationStatus: verification
                ? verification.verificationStatus as VerificationStatus
                : 'PENDING' as VerificationStatus,
        };
    }

    static toDTO(trainer: Trainer, user:User, profileImage?: string): TrainerDetailsResponseDTO {
        return {
            name: user.name,
            email: user.email,
            profileImage: profileImage,
            qualification: trainer.qualification,
            specialisation: trainer.specialisation, 
            experience: trainer.experience,
            about: trainer.about, 
        };
    }

}