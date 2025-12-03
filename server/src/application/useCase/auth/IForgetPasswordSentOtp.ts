export interface IForgetPasswordSentOtpUseCase {
    sendOtp(email: string) : Promise<void>;
}