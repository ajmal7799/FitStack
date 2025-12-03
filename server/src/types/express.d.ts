import 'express';

declare module 'express' {
  export interface Request {
    user?: {
      userId: string;
      role: 'trainer' | 'user' | 'admin';
    };
  }
}