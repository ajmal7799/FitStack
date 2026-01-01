"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHelper = void 0;
class ResponseHelper {
    static success(res, message, data, status = 200 /* HTTPStatus.OK */) {
        return res.status(status).json({
            success: true,
            message,
            data,
        });
    }
    static error(res, message, status = 400 /* HTTPStatus.BAD_REQUEST */) {
        return res.status(status).json({
            success: false,
            message,
            data: null,
        });
    }
}
exports.ResponseHelper = ResponseHelper;
