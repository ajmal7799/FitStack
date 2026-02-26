import { IVerificationModel } from '../../infrastructure/database/models/verificationModel';
import mongoose from 'mongoose';
import { TrainerGetVerificationDTO } from '../dto/trainer/trainerGetVerificationDTO';
import { VerificationDTO } from '../dto/verification/verificationDTO';
import { VerificationStatus } from '../../domain/enum/verificationStatus';
import { Trainer } from '../../domain/entities/trainer/trainerEntities';
import { User } from '../../domain/entities/user/userEntities';
import { TrainerVerification } from '../../domain/entities/trainer/verification';
import { VerificationDetailDTO } from '../dto/verification/verificationDetailsDTO';

export class VerificationMapper {
    static toMongooseDocument(verification: TrainerVerification) {
        return {
            _id: new mongoose.Types.ObjectId(verification.id),
            trainerId: verification.trainerId,
            idCard: verification.idCard,
            educationCert: verification.educationCert,
            experienceCert: verification.experienceCert,
            verificationStatus: verification.verificationStatus,
            rejectionReason: verification.rejectionReason,
            submittedAt: verification.submittedAt,
        };
    }

    static fromMongooseDocument(doc: IVerificationModel): TrainerVerification {
        return {
            id: doc._id.toString(),     
            trainerId: doc.trainerId,
            idCard: doc.idCard,
            educationCert: doc.educationCert,
            experienceCert: doc.experienceCert,
            verificationStatus: doc.verificationStatus,
            rejectionReason: doc.rejectionReason,
            submittedAt: doc.submittedAt,
        };
    }

    static mapToGetVerificationDTO(doc: TrainerVerification): TrainerGetVerificationDTO {
        return {
            trainerId: doc.trainerId,
            idCard: doc.idCard,
            educationCert: doc.educationCert,
            experienceCert: doc.experienceCert,
            verificationStatus: doc.verificationStatus,
            rejectionReason: doc.rejectionReason,
        };
    }

    static  toDTO(verification: TrainerVerification, trainer: Trainer, user: User, profileImage?: string): VerificationDTO {
        return {
            trainerId: verification.trainerId,
            name: user.name,
            email: user.email,
            specialisation: trainer.specialisation,
            verificationStatus: verification.verificationStatus,
            profileImage: profileImage  || undefined,
            averageRating: trainer.averageRating,
            ratingCount: trainer.ratingCount,
        };
    }


    static toDetailDTO(verification: TrainerVerification, trainer: Trainer, user: User): VerificationDetailDTO {
        return {
            trainerId: verification.trainerId,
            name: user.name,
            email: user.email,
            phone: user.phone ?? '',
            about: trainer.about,
            experience: trainer.experience,
            qualification: trainer.qualification,
            specialisation: trainer.specialisation,
            idCard: verification.idCard,
            educationCert: verification.educationCert,
            experienceCert: verification.experienceCert,
            verificationStatus: verification.verificationStatus,
            rejectionReason: verification.rejectionReason,
        };
    }
}