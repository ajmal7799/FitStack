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
exports.GetAllTrainerUseCase = void 0;
const userMappers_1 = require("../../../mappers/userMappers");
class GetAllTrainerUseCase {
    constructor(_userRepository, _storageService, _trainerRepository) {
        this._userRepository = _userRepository;
        this._storageService = _storageService;
        this._trainerRepository = _trainerRepository;
    }
    getAllTrainer(page, limit, status, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const [users, totalUsers] = yield Promise.all([
                this._userRepository.findAllTrainer(skip, limit, status, search),
                this._userRepository.countTrainer(status, search),
            ]);
            const userDTOs = yield Promise.all(users.map((user) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const dto = userMappers_1.UserMapper.toDTO(user);
                // ✅ Get presigned profile image URL
                if (user.profileImage) {
                    dto.profileImage = yield this._storageService.createSignedUrl(user.profileImage, 10 * 60);
                }
                // ✅ Get average rating from trainer profile
                const trainerProfile = yield this._trainerRepository.findByTrainerId(user._id.toString());
                if (trainerProfile) {
                    dto.averageRating = (_a = trainerProfile.averageRating) !== null && _a !== void 0 ? _a : 0;
                }
                return dto;
            })));
            return {
                users: userDTOs,
                totalUsers,
                totalPages: Math.ceil(totalUsers / limit),
                currentPage: page,
            };
        });
    }
}
exports.GetAllTrainerUseCase = GetAllTrainerUseCase;
