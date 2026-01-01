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
const errorHandlingMiddleware_1 = require("./interfaceAdapters/middleware/errorHandlingMiddleware");
const loggerMiddleware_1 = require("./interfaceAdapters/middleware/loggerMiddleware");
class ExpressApp {
    constructor() {
        this._app = (0, express_1.default)();
        mongoConnect_1.mongoConnect.connect();
        this._setLoggingMiddleware();
        this._setMiddlewares();
        this._setRoutes();
        this._setErrorHandlingMiddleware();
    }
    _setMiddlewares() {
        this._app.use((0, cors_1.default)({
            origin: 'http://localhost:5173',
            credentials: true,
        }));
        this._app.use((req, res, next) => {
            if (req.originalUrl === '/stripe/webhook') {
                next();
            }
            else {
                express_1.default.json()(req, res, next);
            }
        });
        // this._app.use(express.json());
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
    }
    listen(port) {
        this._app.listen(port, err => {
            if (err) {
                console.log('Error while starting server');
                throw err;
            }
            else {
                console.log(`✅ Server started on http://localhost:${port}`);
            }
        });
    }
}
const _app = new ExpressApp();
_app.listen(3000);
