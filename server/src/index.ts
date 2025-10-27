import express, { Express } from "express";
import cors from 'cors'
import { User_Router } from "./interfaceAdapters/routes/userRoutes";
import { mongoConnect } from "./infrastructure/database/connectDB/mongoConnect";

class ExpressApp {
    private _app : Express;

    constructor() {
        this._app = express()
        mongoConnect.connect()
        this._setMiddlewares();
        this._setRoutes()
    }

    private _setMiddlewares() {
        this._app.use(
            cors({
                origin: "http://localhost:5173",
                credentials: true
            })
        ) 
        this._app.use(express.json())
    }
  
    private _setRoutes() {
        // this._app.get("/",(req,res)=> {
        //     res.send("server is running")
        // })

         const userRouter = new User_Router();
         this._app.use("/", userRouter.routes); 
    }

  public listen(port:number) {
        this._app.listen(port,(err) => {
            if(err) {
                console.log("Error while starting server")
                throw err
            }else{
                console.log(`✅ Server started on http://localhost:${port}`);
            }
        })
    }
}


const _app = new ExpressApp()
_app.listen(3000)
