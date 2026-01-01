"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.CONFIG = {
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI,
    GOOGLE_MAIL: process.env.GOOGLE_MAIL,
    GOOGLE_APP_PASSWORD: process.env.GOOGLE_APP_PASSWORD,
    REDIS_URL: process.env.REDIS_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    S3_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECERT: process.env.GOOGLE_CLIENT_SECERT,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    FRONTEND_URL: process.env.FRONTEND_URL,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    NODE_ENV: process.env.NODE_ENV
};
