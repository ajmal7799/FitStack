import { IKeyValueTTLCaching } from '../../domain/interfaces/services/ICache/IKeyValueTTLCaching';
import { IJWTService } from '../../domain/interfaces/services/IJWTService';
import { NextFunction, Request, Response } from 'express';
import { HTTPStatus } from '../../shared/constants/httpStatus';
import { Errors, USER_ERRORS } from '../../shared/constants/error';
import { UserRole , UserStatus } from '../../domain/enum/userEnums';
import { IUserRepository } from '../../domain/interfaces/repositories/IUserRepository';
import { NotFoundException, IsBlockedExecption } from '../../application/constants/exceptions';


export class AuthMiddleware {
    constructor(
    private _jwtService: IJWTService,
    private _cacheService: IKeyValueTTLCaching,
    private _userRepository: IUserRepository,
    ) {}

    // --------------------------------------------------
    //              🛠 VERIFY TOKEN
    // --------------------------------------------------

  verify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const header = req.header('Authorization');

        if (!header?.startsWith('Bearer ')) {
            res.status(HTTPStatus.UNAUTHORIZED).json({
                success: false,
                message: Errors.INVALID_TOKEN
            });
            return;
        }

        const token = header.split(' ')[1];

        let decoded;
        try {
            decoded = this._jwtService.verifyAccessToken(token);
        } catch (error) {
            // ✅ Return 401 with specific code so frontend knows to refresh
            res.status(HTTPStatus.UNAUTHORIZED).json({
                success: false,
                message: 'TOKEN_EXPIRED', // ← frontend checks this
            });
            return;
        }

        if (!decoded) {
            res.status(HTTPStatus.UNAUTHORIZED).json({
                success: false,
                message: Errors.INVALID_TOKEN
            });
            return;
        }

        const user = await this._userRepository.findById(decoded.userId);

        if (!user) {
            throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
        }

        if (user.isActive === UserStatus.BLOCKED) {
            throw new IsBlockedExecption(USER_ERRORS.USER_BLOCKED);
        }

        req.user = {
            userId: user._id!,
            role: user.role,
        };

        next();
    } catch (error) {
        next(error);
    }
  }
  
    // --------------------------------------------------
    //              🛠 ROLE CHECKING (reusable)
    // --------------------------------------------------

    hasRole = (...roles: UserRole[]) => {
        return (req: Request, res: Response, next: NextFunction) => {
            if (!req.user) {
                return res.status(HTTPStatus.UNAUTHORIZED).json({
                    success: false,
                    message: Errors.INVALID_TOKEN,
                });
            }

            if (!roles.includes(req.user.role)) {
                return res.status(HTTPStatus.FORBIDDEN).json({
                    success: false,
                    message: Errors.FORBIDDEN,
                });
            }

            next();
        };
    };

    // --------------------------------------------------
    //              🛠 CONVENIENCE ROLE MIDDLEWARES
    // --------------------------------------------------

    isAdmin = this.hasRole(UserRole.ADMIN);

    isTrainer = this.hasRole(UserRole.TRAINER);

    isUser = this.hasRole(UserRole.USER);
}
