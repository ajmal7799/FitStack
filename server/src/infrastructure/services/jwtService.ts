import { CONFIG } from "../config/config";
import { IJWTService } from "../../domain/interfaces/services/IJWTService";
import { JWTPayloadType } from "../../domain/types/JWTPayloadTypes";
import { verify, sign } from 'jsonwebtoken'
import {
    TokenExpiredException,
    TokenMissingException,
    InvalidDataException,
} from "../../application/constants/exceptions"
import { Errors } from "../../shared/constants/error";

export class JWTService implements IJWTService {
    createAccessToken(payload: JWTPayloadType): string {
        const SecreteKey = CONFIG.JWT_SECRET
        if (!SecreteKey) {
            throw new Error("Access Token Secrete Key Not Found")
        }

        try {
            return sign(payload, SecreteKey, { expiresIn: "15m" })
        } catch (error) {
            throw new InvalidDataException(Errors.ACCESS_TOKEN_CREATION_FAILED);
        }

    }


    createRefreshToken(payload: JWTPayloadType): string {
        const SecreteKey = CONFIG.JWT_SECRET
        if (!SecreteKey) {
            throw new Error("Access Token Secrete Key Not Found")
        }

        try {
            return sign(payload, SecreteKey, { expiresIn: "7d" })
        } catch (error) {
            throw new InvalidDataException(Errors.REFRESH_TOKEN_CREATION_FAILED);
        }

    }


    verifyAccessToken(token: string): JWTPayloadType | null {
        const SecreteKey = CONFIG.JWT_SECRET
        if (!SecreteKey) {
            throw new TokenMissingException(Errors.ACCESS_TOKEN_SECRETKEY_MISSING);
        }

        if (!token) {
            throw new TokenMissingException(Errors.ACCESS_TOKEN_MISSING);
        }

        try {
           const decoded =  verify(token,SecreteKey)
            return decoded as JWTPayloadType
        } catch (error) {
            throw new TokenExpiredException(Errors.TOKEN_EXPIRED)
        }

    }

    verifyRefreshToken(token: string): JWTPayloadType | null {
        const SecreteKey = CONFIG.JWT_SECRET
        if (!SecreteKey) {
            throw new Error("Access Token Secrete Key Not Found")
        }
        try {
            const decode = verify(token, SecreteKey) as JWTPayloadType;
            return decode

        } catch (error) {
             throw new TokenExpiredException(Errors.TOKEN_EXPIRED)
        }
    }
}