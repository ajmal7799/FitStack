"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
const userEnums_1 = require("../../domain/enum/userEnums");
const mongoose_1 = __importDefault(require("mongoose"));
class UserMapper {
    static toEntity(dto) {
        return {
            _id: new mongoose_1.default.Types.ObjectId().toString(),
            name: dto.name,
            email: dto.email,
            password: dto.password,
            phone: dto.phone,
            role: dto.role,
            isActive: userEnums_1.UserStatus.ACTIVE,
            googleId: '',
            stripeCustomerId: undefined,
            activeMembershipId: undefined,
            profileImage: undefined,
            // profileCompleted: false,
        };
    }
    static toDTO(entity) {
        return {
            _id: entity._id,
            name: entity.name,
            email: entity.email,
            phone: entity.phone,
            role: entity.role,
            isActive: entity.isActive,
        };
    }
    static toLoginUserResponse(user, verificationCheck = true, userProfileCompleted = true, hasActiveSubscription = false) {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isActive: user.isActive,
            verificationCheck,
            userProfileCompleted,
            profileImage: user.profileImage,
            hasActiveSubscription,
        };
    }
    static toLoginAdminResponse(user) {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
        };
    }
    static toMongooseDocument(user) {
        return {
            _id: new mongoose_1.default.Types.ObjectId(user._id),
            name: user.name,
            email: user.email,
            password: user.password,
            phone: user.phone,
            role: user.role,
            isActive: user.isActive,
            stripeCustomerId: user.stripeCustomerId,
            activeMembershipId: user.activeMembershipId,
            profileImage: user.profileImage
        };
    }
    static fromMongooseDocument(doc) {
        return {
            _id: doc._id.toString(),
            name: doc.name,
            email: doc.email,
            password: doc.password,
            phone: doc.phone,
            role: doc.role,
            isActive: doc.isActive || userEnums_1.UserStatus.ACTIVE,
            stripeCustomerId: doc.stripeCustomerId,
            activeMembershipId: doc.activeMembershipId,
            profileImage: doc.profileImage,
        };
    }
}
exports.UserMapper = UserMapper;
