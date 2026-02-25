export interface CreateFeedbackDto {
    _id: string;
    sessionId: string;
    userId: string;
    trainerId: string;
    rating: number;
    review?: string;
}