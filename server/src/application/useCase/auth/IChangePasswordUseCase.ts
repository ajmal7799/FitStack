

export interface IChangePasswordUseCase {
    changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>;
}