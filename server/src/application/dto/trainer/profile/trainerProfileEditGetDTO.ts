import { VerificationStatus } from '../../../../domain/enum/verificationStatus';

export interface TrainerProfileEditGetDTO {
  name?: string;
  email: string;
  phone: string;
  profileImage?: string;
  about: string;
  experience: number;
  qualification: string;
  specialisation: string;
}
