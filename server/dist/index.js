"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = require("./interfaceAdapters/routes/userRoutes");
const mongoConnect_1 = require("./infrastructure/database/connectDB/mongoConnect");
const adminRoutes_1 = require("./interfaceAdapters/routes/adminRoutes");
const trainerRoutes_1 = require("./interfaceAdapters/routes/trainerRoutes");
const chatRoutes_1 = require("./interfaceAdapters/routes/chatRoutes");
const errorHandlingMiddleware_1 = require("./interfaceAdapters/middleware/errorHandlingMiddleware");
const loggerMiddleware_1 = require("./interfaceAdapters/middleware/loggerMiddleware");
const http_1 = require("http");
const socketServer_1 = require("./infrastructure/socket/socketServer");
const checkExpireySession_1 = require("./infrastructure/cron/checkExpireySession");
const videoCallContainer_1 = require("./infrastructure/DI/videoCall/videoCallContainer");
const userSubscriptionContainer_1 = require("./infrastructure/DI/user/userSubscription/userSubscriptionContainer");
const checkExpirySubscription_1 = require("./infrastructure/cron/checkExpirySubscription");
class ExpressApp {
    constructor() {
        this._app = (0, express_1.default)();
        this._httpServer = (0, http_1.createServer)(this._app);
        socketServer_1.SocketService.init(this._httpServer);
        mongoConnect_1.mongoConnect.connect();
        this._setLoggingMiddleware();
        this._setMiddlewares();
        this._setRoutes();
        this._setErrorHandlingMiddleware();
        this._initCronJobs();
    }
    _initCronJobs() {
        const checkExpireySession = new checkExpireySession_1.CheckExpireySession(videoCallContainer_1.findExpiredSessionUseCase);
        checkExpireySession.start();
        const checkExpirySubscription = new checkExpirySubscription_1.CheckExpirySubscription(userSubscriptionContainer_1.processExpiredSubscriptionsUseCase);
        checkExpirySubscription.start();
    }
    _setMiddlewares() {
        this._app.use((0, cors_1.default)({
            origin: [
                'http://localhost:5173',
                'https://www.fitstack.co.in',
                'https://fitstack.co.in'
            ],
            credentials: true,
        }));
        this._app.use('/stripe/webhook', express_1.default.raw({ type: 'application/json' }));
        this._app.use((req, res, next) => {
            if (req.originalUrl === '/stripe/webhook') {
                next();
            }
            else {
                express_1.default.json()(req, res, next);
            }
        });
        this._app.use((0, cookie_parser_1.default)());
    }
    _setErrorHandlingMiddleware() {
        this._app.use((err, req, res, next) => {
            (0, errorHandlingMiddleware_1.errorHandlingMiddleware)(err, req, res, next);
        });
    }
    _setLoggingMiddleware() {
        (0, loggerMiddleware_1.loggingMiddleware)(this._app);
    }
    _setRoutes() {
        const userRouter = new userRoutes_1.User_Router();
        this._app.use('/', userRouter.routes);
        //  Admin routes
        this._app.use('/admin', new adminRoutes_1.Admin_Routes().get_router());
        // Trainer routes
        this._app.use('/trainer', new trainerRoutes_1.Trainer_Routes().get_router());
        // Chat routes
        this._app.use('/chat', new chatRoutes_1.Chat_Router().get_router());
    }
    listen(port) {
        // IMPORTANT: Listen using _httpServer, not _app
        this._httpServer.listen(port, () => {
            console.log(`✅ Server started on http://localhost:${port}`);
        });
    }
}
const _app = new ExpressApp();
_app.listen(3000);
