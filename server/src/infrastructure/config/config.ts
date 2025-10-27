import dotenv from 'dotenv';
dotenv.config();


export const CONFIG = {
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI,
    GOOGLE_MAIL: process.env.GOOGLE_MAIL,
    GOOGLE_APP_PASSWORD: process.env.GOOGLE_APP_PASSWORD,
    REDIS_URL: process.env.REDIS_URL,
    JWT_SECRET: process.env.JWT_SECRET,
}