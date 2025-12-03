export interface IGoogleAuthService {
  authorize(code: string): Promise<{
    email: string;
    googleId: string;
    name: string;
  }>;
}