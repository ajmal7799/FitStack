

import { TrainerSelectionStatus } from "../../enum/trainerSelectionEnums";

export interface TrainerSelection {
    id: string;
    userId: string; 
    trainerId: string;
    status: TrainerSelectionStatus;
    selectedAt: Date;
}