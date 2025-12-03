import { Response } from 'express';

export function clearRefreshTokenCookie(res: Response) {
    res.clearCookie('RefreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });
}