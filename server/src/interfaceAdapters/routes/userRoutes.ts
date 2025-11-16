import { userAuthController } from "../../infrastructure/DI/Auth/authContainer";
import { Request, Response, Router, NextFunction } from "express";
// import { userProfileController } from "../../infrastructure/DI/user/userContainer";

export class User_Router {
    private _route: Router;

    constructor() {
        this._route = Router()
        this._setRoute();
    }

    private _setRoute() {
        this._route.post("/signup", (req: Request, res: Response, next: NextFunction) => {
            userAuthController.signUpSendOtp(req, res, next)
        })

        this._route.post("/verify-otp",(req: Request, res: Response, next: NextFunction)=> {
            userAuthController.registerUser(req, res, next)
        })

        this._route.post("/login",(req: Request, res: Response, next: NextFunction) => {
            userAuthController.loginUser(req, res, next)
        })

        // this._route.put('/profile',authMiddleware.verify,(req: Request, res: Response)=> {
        //     userProfileController.updateProfile(req,res)
        // })

        this._route.post('/logout',(req: Request, res: Response, next: NextFunction) => {
            userAuthController.handleLogout(req, res, next)
        })
    }

    public get routes(): Router {
        return this._route;
    }
}