export type TrainerVerificationPayload = {
  qualification: string;
  specialisation: string;
  experience: number;
  about: string;

  idCard: File;
  educationCert: File;
  experienceCert: File;
};

export type GetTrainerVerification = {
  trainerId: string;
  idCard: string;
  educationCert: string;
  experienceCert: string;
  verificationStatus: "pending" | "approved" | "rejected";
  rejectionReason?: string | null;
};

export type getAllVerification = {
  _id: string | number | undefined;
  trainerId: string;
  name: string;
  email: string;
  phone: string | null;
  qualification: string | null;
  specialisation: string | null;
  status: "PENDING" | "VERIFIED" | "REJECTED";
};

export type getVerificationDetails = {
  trainerId: string;

  name: string;
  email: string;
  phone: string | null;
  about: string | null;
  experience: number | null;
  qualification: string | null;
  specialisation: string | null;

  
  idCard: string;
  educationCert: string;
  experienceCert: string;
  verificationStatus: "pending" | "approved" | "rejected";
  rejectionReason?: string | null;
};
