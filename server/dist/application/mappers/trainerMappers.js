"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerMapper = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class TrainerMapper {
    static toMongooseDocment(trainer) {
        return {
            _id: new mongoose_1.default.Types.ObjectId(trainer.id),
            trainerId: trainer.trainerId,
            qualification: trainer.qualification,
            specialisation: trainer.specialisation,
            experience: trainer.experience,
            about: trainer.about,
            isVerified: trainer.isVerified,
        };
    }
    static fromMongooseDocument(doc) {
        return {
            id: doc._id.toString(),
            trainerId: doc.trainerId,
            qualification: doc.qualification,
            specialisation: doc.specialisation,
            experience: doc.experience,
            about: doc.about,
            isVerified: doc.isVerified,
        };
    }
    static toTrainerProfileDTO(trainer, user, verification) {
        var _a, _b, _c, _d, _e;
        return {
            name: user.name,
            email: user.email,
            phone: (_a = user.phone) !== null && _a !== void 0 ? _a : undefined,
            profileImage: (_b = user.profileImage) !== null && _b !== void 0 ? _b : undefined,
            about: (_c = trainer.about) !== null && _c !== void 0 ? _c : undefined,
            experience: trainer.experience,
            qualification: (_d = trainer.qualification) !== null && _d !== void 0 ? _d : undefined,
            specialisation: (_e = trainer.specialisation) !== null && _e !== void 0 ? _e : undefined,
            verificationStatus: verification
                ? verification.verificationStatus
                : 'PENDING',
        };
    }
    static toDTO(trainer, user, profileImage) {
        return {
            name: user.name,
            email: user.email,
            profileImage: profileImage,
            qualification: trainer.qualification,
            specialisation: trainer.specialisation,
            experience: trainer.experience,
            about: trainer.about
        };
    }
}
exports.TrainerMapper = TrainerMapper;
