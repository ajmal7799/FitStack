
export interface Trainer {
    id: string;
    trainerId: string; 
    
    qualification: string;
    specialisation: string;  
    experience: number;
    about: string;
    // certifications: string[];
    isVerified: boolean;
}