export interface Feedback {
    _id: string;           // The unique ID for this feedback entry
    sessionId: string;    // Reference to the specific session
    userId: string;       // The user giving the feedback
    trainerId: string;    // The trainer receiving the feedback
    rating: number;       // Must be between 1 and 5
    review?: string;      // Optional text commentary
    createdAt?: Date;
}