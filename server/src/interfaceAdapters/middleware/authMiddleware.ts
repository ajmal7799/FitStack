import { IKeyValueTTLCaching } from '../../domain/interfaces/services/ICache/IKeyValueTTLCaching';
import { IJWTService } from '../../domain/interfaces/services/IJWTService';
import { NextFunction, Request, Response } from 'express';
import { HTTPStatus } from '../../shared/constants/httpStatus';
import { Errors } from '../../shared/constants/error';
import { UserRole } from '../../domain/enum/userEnums';



export class AuthMiddleware {
    constructor(private _jwtService: IJWTService, private _cacheService: IKeyValueTTLCaching) { }

    // --------------------------------------------------
    //              🛠 VERIFY TOKEN
    // --------------------------------------------------

    verify = async(req: Request, res: Response, next: NextFunction) => {

        const header = req.header('Authorization');
        
        
        if (!header?.startsWith('Bearer ')) {
            res.status(HTTPStatus.UNAUTHORIZED).json({ success: false, message: Errors.INVALID_TOKEN });
            return;
        }

        const token = header.split(' ')[1];

        const decoded = this._jwtService.verifyAccessToken(token as string);
        


        if (!decoded) {
            res.status(HTTPStatus.UNAUTHORIZED).json({ success: false, message: Errors.INVALID_TOKEN });
            return;
        }


        (req as any).user = { userId: decoded.userId, role: decoded.role };
        next();

    };

    // --------------------------------------------------
    //              🛠 ADMIN CHECKING 
    // --------------------------------------------------
    isAdmin = async(req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!user) {
            return res.status(HTTPStatus.UNAUTHORIZED).json({
                success: false,
                message: Errors.INVALID_TOKEN,
            });
        }


        if (user.role !== UserRole.ADMIN) {
            return res.status(HTTPStatus.FORBIDDEN).json({
                success: false, message: Errors.FORBIDDEN,
            });
        }
        next();
    };


    checkStatus = () => {
        return async(req: Request, res: Response, next: NextFunction) => {
            const { id } = res.locals.users;

            let userStatus;
        };
    };
}