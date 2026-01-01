"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlingMiddleware = void 0;
const error_1 = require("../../shared/constants/error");
const responseHelper_1 = require("../../shared/utils/responseHelper");
const exceptions_1 = require("../../application/constants/exceptions");
const errorHandlingMiddleware = (err, req, res, next) => {
    void next;
    try {
        let statusCode = 500 /* HTTPStatus.INTERNAL_SERVER_ERROR */;
        if (err instanceof exceptions_1.ApplicationException) {
            if (err instanceof exceptions_1.NotFoundException) {
                statusCode = 404 /* HTTPStatus.NOT_FOUND */;
            }
            else if (err instanceof exceptions_1.AlreadyExisitingExecption) {
                statusCode = 409 /* HTTPStatus.CONFLICT */;
            }
            else if (err instanceof exceptions_1.IsBlockedExecption) {
                statusCode = 403 /* HTTPStatus.FORBIDDEN */;
            }
            else if (err instanceof exceptions_1.InvalidOTPExecption ||
                err instanceof exceptions_1.OTPExpiredException ||
                err instanceof exceptions_1.DataMissingExecption ||
                err instanceof exceptions_1.PasswordNotMatchingException ||
                err instanceof exceptions_1.TokenMissingException ||
                err instanceof exceptions_1.InvalidDataException) {
                statusCode = 400 /* HTTPStatus.BAD_REQUEST */;
            }
            else if (err instanceof exceptions_1.TokenExpiredException) {
                statusCode = 401 /* HTTPStatus.UNAUTHORIZED */;
            }
        }
        responseHelper_1.ResponseHelper.error(res, err instanceof Error ? err.message : error_1.Errors.INTERNAL_SERVER_ERROR, statusCode);
        console.log(err instanceof Error ? err.message : err);
    }
    catch (error) {
        console.log(error);
    }
};
exports.errorHandlingMiddleware = errorHandlingMiddleware;
