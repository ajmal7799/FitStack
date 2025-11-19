import { Router, Request, Response, NextFunction } from "express";
import { adminAuthController, authMiddleware } from "../../infrastructure/DI/Auth/authContainer";
import { adminUserController } from "../../infrastructure/DI/Admin/adminUserContainer";
import { adminTrainerController } from "../../infrastructure/DI/Admin/adminTrainerContainer";


export class Admin_Routes {
    private _route: Router

    constructor() {
        this._route = Router()
        this._setRoute();
    }

    private _setRoute() {


        this._route.post("/login", (req: Request, res: Response, next: NextFunction) => {
            adminAuthController.adminLogin(req, res, next)
        })

        this._route.get("/users", authMiddleware.verify, (req: Request, res: Response, next: NextFunction) => {
            adminUserController.getAllUsers(req, res, next)
        })

        this._route.post("/users/update-status", authMiddleware.verify, (req: Request, res: Response, next: NextFunction) => {
            adminUserController.updateUserStatus(req, res, next)
        })

        this._route.get("/trainers", authMiddleware.verify, (req: Request, res: Response, next: NextFunction) => {
            adminTrainerController.getAllTrainer(req, res, next)
        })

        this._route.post("/trainers/update-status", authMiddleware.verify, (req: Request, res: Response, next: NextFunction) => {
            adminTrainerController.updateTrainerStatus(req, res, next)
        })
    }

    public get_router(): Router {
        return this._route;
    }
}