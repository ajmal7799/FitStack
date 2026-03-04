export interface TrainerDetailsAdminDTO {
    // User info
    _id: string;
    name: string;
    email: string;
    phone: string;
    profileImage?: string;
    isActive: string;
    // Trainer profile
    qualification: string;
    specialisation: string;
    experience: number;
    about: string;
    isVerified: boolean;
    averageRating: number;
    ratingCount: number;
    // Stats
    totalEarnings: number;
    totalClients: number;
}