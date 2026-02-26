import { CONFIG } from '../config/config';
import { IJWTService } from '../../domain/interfaces/services/IJWTService';
import { JWTPayloadType } from '../../domain/types/JWTPayloadTypes';
import { verify, sign } from 'jsonwebtoken';
import {
    TokenExpiredException,
    TokenMissingException,
    InvalidDataException,
} from '../../application/constants/exceptions';
import { Errors } from '../../shared/constants/error';

export class JWTService implements IJWTService {

    createAccessToken(payload: JWTPayloadType): string {
        const secretKey = CONFIG.JWT_SECRET;
        if (!secretKey) throw new Error('Access Token Secret Key Not Found');
        try {
            return sign(payload, secretKey, { expiresIn: '15m' }); // ← short lived
        } catch (error) {
            throw new InvalidDataException(Errors.ACCESS_TOKEN_CREATION_FAILED);
        }
    }

    createRefreshToken(payload: JWTPayloadType): string {
        const secretKey = CONFIG.JWT_REFRESH_SECRET; // ← separate secret
        if (!secretKey) throw new Error('Refresh Token Secret Key Not Found');
        try {
            return sign(payload, secretKey, { expiresIn: '7d' }); // ← long lived
        } catch (error) {
            throw new InvalidDataException(Errors.REFRESH_TOKEN_CREATION_FAILED);
        }
    }

    verifyAccessToken(token: string): JWTPayloadType | null {
        const secretKey = CONFIG.JWT_SECRET;
        if (!secretKey) throw new TokenMissingException(Errors.ACCESS_TOKEN_SECRETKEY_MISSING);
        if (!token) throw new TokenMissingException(Errors.ACCESS_TOKEN_MISSING);
        try {
            return verify(token, secretKey) as JWTPayloadType;
        } catch (error) {
            throw new TokenExpiredException(Errors.TOKEN_EXPIRED);
        }
    }

    verifyRefreshToken(token: string): JWTPayloadType | null {
        const secretKey = CONFIG.JWT_REFRESH_SECRET; // ← separate secret
        if (!secretKey) throw new Error('Refresh Token Secret Key Not Found');
        if (!token) throw new TokenMissingException(Errors.ACCESS_TOKEN_MISSING);
        try {
            return verify(token, secretKey) as JWTPayloadType;
        } catch (error) {
            throw new TokenExpiredException(Errors.TOKEN_EXPIRED);
        }
    }
}