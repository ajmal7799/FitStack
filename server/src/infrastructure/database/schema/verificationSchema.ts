import mongoose from 'mongoose';
import { VerificationStatus } from '../../../domain/enum/verificationStatus';


const verificationSchema = new mongoose.Schema(
    {
        trainerId: { type: String, required: true, unique: true },
        idCard: { type: String, required: true },
        educationCert: { type: String, required: true },
        experienceCert: { type: String, required: true },
        verificationStatus: { type: String, required: true, enum: Object.values(VerificationStatus), default: VerificationStatus.PENDING },
        rejectionReason: { type: String },
        submittedAt: { type: Date, required: true },
    },
);

export default verificationSchema;