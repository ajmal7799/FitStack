import { UserGender,DietPreference, ExperienceLevel,FitnessGoal,WorkoutLocation } from '../enum/userProfileEnums';
export type UserProfilePayload = {
  userId?: string;
  age: number;
  gender: UserGender;
  height: number;
  weight: number;
  fitnessGoal: FitnessGoal;
  targetWeight: number;
  experienceLevel: ExperienceLevel;
workoutLocation: WorkoutLocation;
  profileImage?: File;
  dietPreference?: DietPreference;
  preferredWorkoutTypes?: string[];
  medicalConditions?: string[];
  
  
};
