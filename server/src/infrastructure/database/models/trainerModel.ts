import { Document, model } from 'mongoose';
import trainerSchema from '../schema/trainerSchema';

export interface ITrainerModel extends Document {
    _id: string;
    trainerId: string; 
    qualification: string;
    specialisation: string;  
    experience: number;
    about: string;
    // certifications: string[];
    isVerified: boolean;
}

export const trainerModel = model<ITrainerModel>('Trainer', trainerSchema);
