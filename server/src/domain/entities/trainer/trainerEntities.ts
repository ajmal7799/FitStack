
export interface Trainer {
    id: string;
    trainerId: string; 
    
    qualification: string;
    specialisation: string;  
    experience: number;
    about: string;
    isVerified: boolean;
    ratingCount: number;  
    ratingSum: number;    
    averageRating: number; 
}