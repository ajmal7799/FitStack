import { Errors } from '../../shared/constants/error';
import { HTTPStatus } from '../../shared/constants/httpStatus';
import { ResponseHelper } from '../../shared/utils/responseHelper';
import {
    AlreadyExisitingExecption,
    ApplicationException,
    DataMissingExecption,
    InvalidDataException, 
    InvalidOTPExecption,
    IsBlockedExecption,
    NotFoundException,
    OTPExpiredException,
    PasswordNotMatchingException,
    TokenExpiredException,
    TokenMissingException,
    ConflictException
} from '../../application/constants/exceptions';

import { Request, Response, NextFunction } from 'express';

export const errorHandlingMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    void next;
    try {
        let statusCode = HTTPStatus.INTERNAL_SERVER_ERROR;

        if (err instanceof ApplicationException) {
            if (err instanceof NotFoundException) {
                statusCode = HTTPStatus.NOT_FOUND;
            } else if (err instanceof AlreadyExisitingExecption || err instanceof ConflictException) {
                statusCode = HTTPStatus.CONFLICT;
            } else if (err instanceof IsBlockedExecption) {
                statusCode = HTTPStatus.FORBIDDEN;
            } else if (err instanceof InvalidOTPExecption ||
                err instanceof OTPExpiredException ||
                err instanceof DataMissingExecption ||
                err instanceof PasswordNotMatchingException ||
                err instanceof TokenMissingException ||
                err instanceof InvalidDataException) {
                statusCode = HTTPStatus.BAD_REQUEST;
            } else if (err instanceof TokenExpiredException) {
                statusCode = HTTPStatus.UNAUTHORIZED;
            }
        }

        ResponseHelper.error(
            res,
            err instanceof Error ? err.message : Errors.INTERNAL_SERVER_ERROR,
            statusCode,
        );
        console.log(err instanceof Error ? err.message : err);

    } catch (error) {
        console.log(error);
    }
};

















