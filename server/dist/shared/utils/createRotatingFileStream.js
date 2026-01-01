"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRotatingFileStream = void 0;
const rfs = require("rotating-file-stream");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Helper to ensure directory exists
function ensureDir(dir) {
    if (!fs_1.default.existsSync(dir))
        fs_1.default.mkdirSync(dir, { recursive: true });
}
const createRotatingFileStream = (interval, maxFiles, dirPath) => {
    ensureDir(dirPath);
    return rfs.createStream((time) => {
        if (!time)
            return path_1.default.join(dirPath, "buffer.log");
        const fileName = new Date().toISOString().split("T")[0] + ".log";
        return path_1.default.join(dirPath, fileName);
    }, {
        interval,
        maxFiles,
        compress: "gzip",
    });
};
exports.createRotatingFileStream = createRotatingFileStream;
