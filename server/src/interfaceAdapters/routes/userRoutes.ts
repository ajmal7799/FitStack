import { userAuthController } from "../../infrastructure/DI/Auth/authContainer";
import { Request, Response, Router } from "express";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { userProfileController } from "../../infrastructure/DI/user/userContainer";
import { authMiddleware } from "../../infrastructure/DI/Auth/authContainer";

export class User_Router {
    private _route: Router;

    constructor() {
        this._route = Router()
        this._setRoute();
    }

    private _setRoute() {
        this._route.post("/signup", (req: Request, res: Response) => {
            userAuthController.signUpSendOtp(req, res)
        })

        this._route.post("/verify-otp",(req: Request, res: Response)=> {
            userAuthController.registerUser(req,res)
        })

        this._route.post("/login",(req: Request, res: Response) => {
            userAuthController.loginUser(req,res)
        })

        this._route.put('/profile',authMiddleware.verify,(req: Request, res: Response)=> {
            userProfileController.updateProfile(req,res)
        })
    }

    public get routes(): Router {
        return this._route;
    }
}