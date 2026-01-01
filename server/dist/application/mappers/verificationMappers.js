"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationMapper = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class VerificationMapper {
    static toMongooseDocument(verification) {
        return {
            _id: new mongoose_1.default.Types.ObjectId(verification.id),
            trainerId: verification.trainerId,
            idCard: verification.idCard,
            educationCert: verification.educationCert,
            experienceCert: verification.experienceCert,
            verificationStatus: verification.verificationStatus,
            rejectionReason: verification.rejectionReason,
            submittedAt: verification.submittedAt,
        };
    }
    static fromMongooseDocument(doc) {
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
    static mapToGetVerificationDTO(doc) {
        return {
            trainerId: doc.trainerId,
            idCard: doc.idCard,
            educationCert: doc.educationCert,
            experienceCert: doc.experienceCert,
            verificationStatus: doc.verificationStatus,
            rejectionReason: doc.rejectionReason,
        };
    }
    static toDTO(verification, trainer, user, profileImage) {
        return {
            trainerId: verification.trainerId,
            name: user.name,
            email: user.email,
            specialisation: trainer.specialisation,
            verificationStatus: verification.verificationStatus,
            profileImage: profileImage || undefined,
        };
    }
    static toDetailDTO(verification, trainer, user) {
        var _a;
        return {
            trainerId: verification.trainerId,
            name: user.name,
            email: user.email,
            phone: (_a = user.phone) !== null && _a !== void 0 ? _a : '',
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
exports.VerificationMapper = VerificationMapper;
