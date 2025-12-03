export interface ForgetPasswordVerifyOtpRequestDTO {
  email: string;
  otp: string;
}

export interface ForgetPasswordResetPasswordRequestDTO {
  email: string;
  password: string;
  token: string;
  
}