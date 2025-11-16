import { Router,Request,Response, NextFunction } from "express";
import { adminAuthController } from "../../infrastructure/DI/Auth/authContainer";



export class Admin_Routes {
    private _route: Router

    constructor() {
        this._route = Router()
        this._setRoute();
    }

    private _setRoute() {
        this._route.post("/login",(req: Request, res:Response, next: NextFunction) => {
            adminAuthController.adminLogin(req,res, next)
        })
    }

    public get_router():Router {
        return this._route;
    }
}