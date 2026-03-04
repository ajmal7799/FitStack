"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketAuthMiddleware = void 0;
const jwtService_1 = require("../../infrastructure/services/jwtService");
const jwtService = new jwtService_1.JWTService();
const socketAuthMiddleware = (socket, next) => {
    try {
        // 1. Get token from the 'auth' object sent by frontend
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }
        // 2. Verify the token
        const decoded = jwtService.verifyAccessToken(token);
        if (!decoded)
            return next(new Error('Unauthorized'));
        // 3. Attach the userId to the socket for later use
        socket.data.userId = decoded.userId;
        next(); // Success!
    }
    catch (error) {
        next(new Error('Authentication error: Invalid token'));
    }
};
exports.socketAuthMiddleware = socketAuthMiddleware;
