import express, { Express, NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { User_Router } from './interfaceAdapters/routes/userRoutes';
import { mongoConnect } from './infrastructure/database/connectDB/mongoConnect';
import { Admin_Routes } from './interfaceAdapters/routes/adminRoutes';
import { Trainer_Routes } from './interfaceAdapters/routes/trainerRoutes';
import { Chat_Router } from './interfaceAdapters/routes/chatRoutes';
import { errorHandlingMiddleware } from './interfaceAdapters/middleware/errorHandlingMiddleware';
import { loggingMiddleware } from './interfaceAdapters/middleware/loggerMiddleware';
import { createServer, Server as HttpServer } from 'http';
import { SocketService } from './infrastructure/socket/socketServer';
import { CONFIG } from './infrastructure/config/config';
import { CheckExpireySession } from './infrastructure/cron/checkExpireySession';
import { findExpiredSessionUseCase } from './infrastructure/DI/videoCall/videoCallContainer';
import { processExpiredSubscriptionsUseCase } from './infrastructure/DI/user/userSubscription/userSubscriptionContainer';
import { CheckExpirySubscription } from './infrastructure/cron/checkExpirySubscription';


class ExpressApp {
    private _app: Express;
    private _httpServer: HttpServer; 


    constructor() {
        this._app = express();
        this._httpServer = createServer(this._app);

        SocketService.init(this._httpServer);
    
        mongoConnect.connect();
        this._setLoggingMiddleware();
        this._setMiddlewares();
        this._setRoutes();
        this._setErrorHandlingMiddleware();
        this._initCronJobs();
    }

    private _initCronJobs() {
        
        const checkExpireySession = new CheckExpireySession( findExpiredSessionUseCase);
        checkExpireySession.start();

        const checkExpirySubscription = new CheckExpirySubscription(processExpiredSubscriptionsUseCase);
        checkExpirySubscription.start();
    }

    private _setMiddlewares() {
        this._app.use(
            cors({
                origin: CONFIG.FRONTEND_URL,
                credentials: true,
            }),
        );
        this._app.use('/stripe/webhook', express.raw({ type: 'application/json' }));


        this._app.use((req, res, next) => {
            if (req.originalUrl === '/stripe/webhook') {
                next();
            } else {
                express.json()(req, res, next);
            }
        });

        // this._app.use(express.json());
        this._app.use(cookieParser());
    }

    private _setErrorHandlingMiddleware() {
        this._app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            errorHandlingMiddleware(err, req, res, next);
        });
    }

    private _setLoggingMiddleware() {
        loggingMiddleware(this._app);
    }

    private _setRoutes() {
        const userRouter = new User_Router();
        this._app.use('/', userRouter.routes);

        //  Admin routes
        this._app.use('/admin', new Admin_Routes().get_router());

        // Trainer routes
        this._app.use('/trainer', new Trainer_Routes().get_router());

        // Chat routes
        this._app.use('/chat', new Chat_Router().get_router());
    }

  public listen(port: number) {
        // IMPORTANT: Listen using _httpServer, not _app
        this._httpServer.listen(port, () => {
            console.log(`✅ Server started on http://localhost:${port}`);
            
        });
    }
}

const _app = new ExpressApp();
_app.listen(3000);
