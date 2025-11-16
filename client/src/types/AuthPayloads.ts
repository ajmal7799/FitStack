export type SignupPayload = {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: string;
  
};

export type OtpPayload = {
  email: string;
  otp: string;
};

export type LoginPayload = { 
  email: string;
  password: string;   
};