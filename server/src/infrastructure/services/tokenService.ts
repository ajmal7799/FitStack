import { v4 as uuidv4 } from 'uuid';
import { ITokenService } from '../../domain/interfaces/services/ITokenService';

export class TokenSerivce implements ITokenService {
    createToken(): string {
        return uuidv4();
    }
}
