import { userModel } from '../../database/models/userModel';
import { UserRepository } from '../../repositories/userRepository';
import { HashPassword } from '../../services/hashPasswordService';
import { RegisterUserUseCase } from '../../../application/implementation/auth/user/signupUserUseCase';
import { UserAuthController } from '../../../interfaceAdapters/controller/auth/userAuthController';
import { OtpService } from '../../services/otpService';
import { OtpEmailContentGenerator } from '../../services/Email/EmailContentGenerator/otpEmailContentGenerator';
import { EmailService } from '../../services/Email/emailService';
import { SignUpSendOtpUseCase } from '../../../application/implementation/auth/user/signUpSendOtpUseCase';
import { VerifyOtpUseCase } from '../../../application/implementation/auth/verifyOtpUseCase';
import { KeyValueTTLCaching } from '../../cache/redis/KeyValueTTLCaching';
import { JWTService } from '../../services/jwtService';
import { TokenCreationUseCase } from '../../../application/implementation/auth/tokenCreationUseCase';
import { UserLoginUseCase } from '../../../application/implementation/auth/user/loginUserUseCase';
import { AuthMiddleware } from '../../../interfaceAdapters/middleware/authMiddleware';
import { AdminLoginUseCase } from '../../../application/implementation/auth/admin/AdminLoginUseCase';
import { AdminAuthController } from '../../../interfaceAdapters/controller/auth/adminAuthController';
import { TokenInvalidationUseCase } from '../../../application/implementation/auth/tokenInvalidationUseCase';
import { ResendOtpUseCase } from '../../../application/implementation/auth/resendOtpUseCase';
import { ForgetPasswordSentOtp } from '../../../application/implementation/auth/forgetPasswordSentOtp';
import { ForgetPasswordVerifyOtpUseCase } from '../../../application/implementation/auth/forgetPasswordVerifyOtpUseCase';
import { TokenSerivce } from '../../services/tokenService';
import { ForgetPasswordResetPasswordUseCase } from '../../../application/implementation/auth/forgetPasswordResetPassword';
import { TrainerRepository } from '../../repositories/trainerRepository';
import { trainerModel } from '../../database/models/trainerModel';
import { GoogleAuthService } from '../../services/googleAuthService';
import { UserGoogleLoginUseCase } from '../../../application/implementation/auth/userGoogleLoginUseCase';
import { UserProfileRepository } from '../../repositories/userProfileRepository';
import { userProfileModel } from '../../database/models/userProfileModel';
import { RefreshTokenUseCase } from '../../../application/implementation/auth/refreshTokenUseCase';
import { ChangePasswordUseCase } from '../../../application/implementation/auth/changePasswordUseCase';
import { StorageService } from '../../services/Storage/storageService';

//Repositories & Services
const userRepository = new UserRepository(userModel);
const hashService = new HashPassword();
const otpService = new OtpService();
const otpContentGenerator = new OtpEmailContentGenerator();
const emailService = new EmailService();
const cacheStorage = new KeyValueTTLCaching();
const jwtService = new JWTService();
const tokenService = new TokenSerivce();
const trainerRepository = new TrainerRepository(trainerModel);
const googleAuthService = new GoogleAuthService();
const userProfileRepository = new UserProfileRepository(userProfileModel);
const storageService = new StorageService();


//UseCases
const registerUserUseCase = new RegisterUserUseCase(userRepository, hashService);
const userSendOtpUseCase = new SignUpSendOtpUseCase(
    otpService,
    otpContentGenerator,
    emailService,
    userRepository,
    cacheStorage,
);
const verifyOtpUseCase = new VerifyOtpUseCase(cacheStorage);
const tokenCreationUseCase = new TokenCreationUseCase(jwtService);
const userLoginUseCase = new UserLoginUseCase(userRepository,hashService,trainerRepository,userProfileRepository,storageService);
const adminLoginUseCase = new AdminLoginUseCase(userRepository,hashService);
const tokenValidationUseCase = new TokenInvalidationUseCase(jwtService,cacheStorage);
const resendOtpUseCase = new ResendOtpUseCase(
    otpService,
    otpContentGenerator,
    emailService,
    userRepository,
    cacheStorage,
);

const forgetPasswordSentOtp = new ForgetPasswordSentOtp(
    userRepository,
    otpService,
    otpContentGenerator,
    emailService,
    cacheStorage,
);

const forgetPasswordVerifyOtpUseCase = new ForgetPasswordVerifyOtpUseCase(cacheStorage, tokenService); 
const forgetPasswordResetPasswordUseCase = new ForgetPasswordResetPasswordUseCase(
    cacheStorage,
    userRepository,
    hashService,
);

const googleAuthUseCase = new UserGoogleLoginUseCase(googleAuthService,userRepository,userProfileRepository);

const refreshTokenUseCase = new RefreshTokenUseCase(jwtService);
const changePasswordUseCase = new ChangePasswordUseCase(userRepository,hashService);

//Controller
export const userAuthController = new UserAuthController(
    registerUserUseCase,
    userSendOtpUseCase,
    verifyOtpUseCase,
    tokenCreationUseCase,
    userLoginUseCase,
    tokenValidationUseCase,
    resendOtpUseCase,
    forgetPasswordSentOtp,
    forgetPasswordVerifyOtpUseCase,
    forgetPasswordResetPasswordUseCase,
    googleAuthUseCase,
    jwtService,
    refreshTokenUseCase,
    changePasswordUseCase
 
);


export const adminAuthController = new AdminAuthController(adminLoginUseCase,tokenCreationUseCase);

/// Middleware
export const authMiddleware = new AuthMiddleware(jwtService,cacheStorage,userRepository);


