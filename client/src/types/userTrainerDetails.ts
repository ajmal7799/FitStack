export interface TrainerDetails {
  name: string;
  email: string;
  profileImage?: string;       // optional - some trainers may not have it
  qualification?: string;      // optional
  specialisation?: string;     // optional
  experience: number;          // seems to always be present (integer)
  about?: string;              // optional
}

export interface TrainerApiResponse {
  success: boolean;
  message: string;
  data: {
    result: TrainerDetails;
  };
}
export type Trainer = TrainerDetails;