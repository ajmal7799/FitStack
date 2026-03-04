"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTrainerDetailsUseCase = void 0;
const exceptions_1 = require("../../../constants/exceptions");
class GetTrainerDetailsUseCase {
    constructor(_trainerRepository, _userRepository, _walletRepository, _storageService, _trainerSelectRepository) {
        this._trainerRepository = _trainerRepository;
        this._userRepository = _userRepository;
        this._walletRepository = _walletRepository;
        this._storageService = _storageService;
        this._trainerSelectRepository = _trainerSelectRepository;
    }
    getTrainerDetails(trainerId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const user = yield this._userRepository.findById(trainerId);
            if (!user)
                throw new exceptions_1.NotFoundException('Trainer not found');
            // 2. Get trainer profile
            const trainerProfile = yield this._trainerRepository.findByTrainerId(trainerId);
            if (!trainerProfile)
                throw new exceptions_1.NotFoundException('Trainer profile not found');
            // 3. Get presigned profile image
            let profileImage;
            if (user.profileImage) {
                profileImage = yield this._storageService.createSignedUrl(user.profileImage, 10 * 60);
            }
            // 4. Get total earnings from wallet
            const wallet = yield this._walletRepository.findByOwnerId(trainerId, 'trainer');
            const totalEarnings = (_a = wallet === null || wallet === void 0 ? void 0 : wallet.balance) !== null && _a !== void 0 ? _a : 0;
            const totalClients = yield this._trainerSelectRepository.countByTrainerId(trainerId);
            return {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone,
                profileImage,
                isActive: user.isActive,
                qualification: trainerProfile.qualification,
                specialisation: trainerProfile.specialisation,
                experience: trainerProfile.experience,
                about: trainerProfile.about,
                isVerified: trainerProfile.isVerified,
                averageRating: (_b = trainerProfile.averageRating) !== null && _b !== void 0 ? _b : 0,
                ratingCount: (_c = trainerProfile.ratingCount) !== null && _c !== void 0 ? _c : 0,
                totalEarnings,
                totalClients,
            };
        });
    }
}
exports.GetTrainerDetailsUseCase = GetTrainerDetailsUseCase;
