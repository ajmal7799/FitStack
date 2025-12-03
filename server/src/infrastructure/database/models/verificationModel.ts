import { Document, model } from 'mongoose';
import verificationSchema from '../schema/verificationSchema';
import { VerificationStatus } from '../../../domain/enum/verificationStatus';

export interface IVerificationModel extends Document {
    _id: string;
    trainerId: string;
    idCard: string;
    educationCert: string;
    experienceCert: string;
    verificationStatus: VerificationStatus;
    rejectionReason?: string;
    submittedAt: Date;
}

export const verificationModel = model<IVerificationModel>('Verification', verificationSchema);