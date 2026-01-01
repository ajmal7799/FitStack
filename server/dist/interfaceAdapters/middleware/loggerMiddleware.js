"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggingMiddleware = loggingMiddleware;
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("../../infrastructure/config/config");
const createRotatingFileStream_1 = require("../../shared/utils/createRotatingFileStream");
const path_1 = __importDefault(require("path"));
function loggingMiddleware(app) {
    if (config_1.CONFIG.NODE_ENV === "development") {
        app.use((0, morgan_1.default)("combined"));
    }
    else {
        console.log("he");
        const accessLogsStream = (0, createRotatingFileStream_1.createRotatingFileStream)("1d", 7, path_1.default.join(__dirname, "..", "..", "logs", "accesslogs"));
        const errorLogsStream = (0, createRotatingFileStream_1.createRotatingFileStream)("1d", 7, path_1.default.join(__dirname, "..", "..", "logs", "errorLogs"));
        app.use((0, morgan_1.default)("combined", { stream: accessLogsStream }));
        app.use((0, morgan_1.default)("combined", {
            stream: errorLogsStream,
            skip: (req, res) => res.statusCode < 400,
        }));
    }
}
