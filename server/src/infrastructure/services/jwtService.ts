import { CONFIG } from "../config/config";
import { IJWTService } from "../../domain/interfaces/services/IJWTService";
import { JWTPayloadType } from "../../domain/types/JWTPayloadTypes";
import { verify, sign } from 'jsonwebtoken'
import { decode } from "punycode";

export class JWTService implements IJWTService {
    createAccessToken(payload: JWTPayloadType): string {
        const SecreteKey = CONFIG.JWT_SECRET
        if (!SecreteKey) {
            throw new Error("Access Token Secrete Key Not Found")
        }
        return sign(payload, SecreteKey, { expiresIn: "15m" })
    }


    createRefreshToken(payload: JWTPayloadType): string {
        const SecreteKey = CONFIG.JWT_SECRET
        if (!SecreteKey) {
            throw new Error("Access Token Secrete Key Not Found")
        }

        return sign(payload, SecreteKey, { expiresIn: "7d" })
    }


    verifyAccessToken(token: string): JWTPayloadType | null {
        const SecreteKey = CONFIG.JWT_SECRET
        if (!SecreteKey) {
            throw new Error("Access Token Secrete Key Not Found")
        }
        verify(token, SecreteKey, (err, decoded) => {
            if (err) return null
            return decoded as JWTPayloadType
        })
        return null

    }

    verifyRefreshToken(token: string): JWTPayloadType | null {
        const SecreteKey = CONFIG.JWT_SECRET
        if (!SecreteKey) {
            throw new Error("Access Token Secrete Key Not Found")
        }
        try {
            const decode = verify(token,SecreteKey) as JWTPayloadType;
            return decode
            
        } catch (error) {
            return null
        }
    }
}