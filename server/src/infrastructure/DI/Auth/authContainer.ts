import { userModel } from "../../database/models/userModel";
import { UserRepository } from "../../repositories/userRepository";
import { HashPassword } from "../../services/hashPasswordService";
import { RegisterUserUseCase } from "../../../application/implementation/auth/user/signupUserUseCase";
import { UserAuthController } from "../../../interfaceAdapters/controller/auth/userAuthController";
import { OtpService } from "../../services/otpService";
import { OtpEmailContentGenerator } from "../../services/Email/EmailContentGenerator/otpEmailContentGenerator";
import { EmailService } from "../../services/Email/emailService";
import { SignUpSendOtpUseCase } from "../../../application/implementation/auth/user/signUpSendOtpUseCase";
import { VerifyOtpUseCase } from "../../../application/implementation/auth/verifyOtpUseCase";
import { KeyValueTTLCaching } from "../../cache/redis/KeyValueTTLCaching";
import { JWTService } from "../../services/jwtService";
import { TokenCreationUseCase } from "../../../application/implementation/auth/tokenCreationUseCase";
import { UserLoginUseCase } from "../../../application/implementation/auth/user/loginUserUseCase";
import { AuthMiddleware } from "../../../interfaceAdapters/middleware/authMiddleware";
import { AdminLoginUseCase } from "../../../application/implementation/auth/admin/AdminLoginUseCase";
import { AdminAuthController } from "../../../interfaceAdapters/controller/auth/adminAuthController";
import { TokenInvalidationUseCase } from "../../../application/implementation/auth/tokenInvalidationUseCase";



//Repositories & Services
const userRepository = new UserRepository(userModel);
const hashService = new HashPassword();
const otpService = new OtpService()
const otpContentGenerator = new OtpEmailContentGenerator()
const emailService = new EmailService()
const cacheStorage = new KeyValueTTLCaching()
const jwtService = new JWTService()

//UseCases
const registerUserUseCase = new RegisterUserUseCase(userRepository, hashService)
const userSendOtpUseCase = new SignUpSendOtpUseCase(
    otpService,
    otpContentGenerator,
    emailService,
    userRepository,
    cacheStorage,
)
const verifyOtpUseCase = new VerifyOtpUseCase(cacheStorage)
const tokenCreationUseCase = new TokenCreationUseCase(jwtService)
const userLoginUseCase = new UserLoginUseCase(userRepository,hashService)
const adminLoginUseCase = new AdminLoginUseCase(userRepository,hashService)
const tokenValidationUseCase = new TokenInvalidationUseCase(jwtService,cacheStorage)



//Controller
export const userAuthController = new UserAuthController(
    registerUserUseCase,
    userSendOtpUseCase,
    verifyOtpUseCase,
    tokenCreationUseCase,
    userLoginUseCase,
    tokenValidationUseCase,
 
)


export const adminAuthController = new AdminAuthController(adminLoginUseCase,tokenCreationUseCase)

/// Middleware
export const authMiddleware = new AuthMiddleware(jwtService,cacheStorage)


