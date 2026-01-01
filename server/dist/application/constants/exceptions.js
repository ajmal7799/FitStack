"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidDataException = exports.OTPExpiredException = exports.TokenMissingException = exports.TokenExpiredException = exports.PasswordNotMatchingException = exports.DataMissingExecption = exports.InvalidOTPExecption = exports.IsBlockedExecption = exports.AlreadyExisitingExecption = exports.NotFoundException = exports.ApplicationException = void 0;
class ApplicationException extends Error {
    constructor(message) {
        super(message);
    }
}
exports.ApplicationException = ApplicationException;
class NotFoundException extends ApplicationException {
    constructor(message) {
        super(message);
    }
}
exports.NotFoundException = NotFoundException;
class AlreadyExisitingExecption extends ApplicationException {
    constructor(message) {
        super(message);
    }
}
exports.AlreadyExisitingExecption = AlreadyExisitingExecption;
class IsBlockedExecption extends ApplicationException {
    constructor(message) {
        super(message);
    }
}
exports.IsBlockedExecption = IsBlockedExecption;
class InvalidOTPExecption extends ApplicationException {
    constructor(message) {
        super(message);
    }
}
exports.InvalidOTPExecption = InvalidOTPExecption;
class DataMissingExecption extends ApplicationException {
    constructor(message) {
        super(message);
    }
}
exports.DataMissingExecption = DataMissingExecption;
class PasswordNotMatchingException extends ApplicationException {
    constructor(message) {
        super(message);
    }
}
exports.PasswordNotMatchingException = PasswordNotMatchingException;
class TokenExpiredException extends ApplicationException {
    constructor(message) {
        super(message);
    }
}
exports.TokenExpiredException = TokenExpiredException;
class TokenMissingException extends ApplicationException {
    constructor(message) {
        super(message);
    }
}
exports.TokenMissingException = TokenMissingException;
class OTPExpiredException extends ApplicationException {
    constructor(message) {
        super(message);
    }
}
exports.OTPExpiredException = OTPExpiredException;
class InvalidDataException extends ApplicationException {
    constructor(message) {
        super(message);
    }
}
exports.InvalidDataException = InvalidDataException;
