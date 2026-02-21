/**
 * Represents an individual time slot for a trainer.
 */
export interface ISlot {
    _id: string;
    trainerId: string;
    startTime: string; // ISO 8601 string
    endTime: string;   // ISO 8601 string
    isBooked: boolean;
    bookedBy: string | null;
}

/**
 * Represents the paginated result object within the data.
 */
export interface ISlotResult {
    slots: ISlot[];
    totalSlots: number;
    totalPages: number;
    currentPage: number;
}

/**
 * The standard wrapper for the API response.
 */
export interface ISlotResponse {
    success: boolean;
    message: string;
    data: {
        result: ISlotResult;
    };
}


