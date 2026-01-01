import mongoose from 'mongoose';
import {
 
    UserRole,
    UserStatus,
  
} from '../../../domain/enum/userEnums';

const userSchema = new mongoose.Schema(
    {
    // Auth fields
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: false,
        },
        password: {
            type: String,
            required: true,
            
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.USER,
        },
        isActive: {
            type: String,
            enum: Object.values(UserStatus),
            default: UserStatus.ACTIVE,
        },
        stripeCustomerId: {
            type: String,
            index: true,
            required: false,
        },
        activeMembershipId: {
            type: String,
            required: false,
        },
        profileImage: { type: String },
    },
    { timestamps: true },
);

export default userSchema;
