import { Response } from 'express';

export function setRefreshTokenCookie(res: Response, refreshToken: string) {
 
    res.cookie('RefreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,	
    });
}