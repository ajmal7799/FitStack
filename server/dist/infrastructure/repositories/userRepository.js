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
exports.UserRepository = void 0;
const baseRepository_1 = require("./baseRepository");
const userMappers_1 = require("../../application/mappers/userMappers");
const userEnums_1 = require("../../domain/enum/userEnums");
class UserRepository extends baseRepository_1.BaseRepository {
    constructor(_model) {
        super(_model, userMappers_1.UserMapper);
        this._model = _model;
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this._model.findOne({ email });
            if (!doc)
                return null;
            return userMappers_1.UserMapper.fromMongooseDocument(doc);
        });
    }
    findAllUsers() {
        return __awaiter(this, arguments, void 0, function* (skip = 0, limit = 10, isActive, search) {
            const query = { role: userEnums_1.UserRole.USER };
            if (isActive) {
                query.isActive = isActive;
            }
            if (search) {
                query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
            }
            const docs = yield this._model.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
            return docs.map(doc => userMappers_1.UserMapper.fromMongooseDocument(doc));
        });
    }
    countUsers(isActive_1, search_1) {
        return __awaiter(this, arguments, void 0, function* (isActive, search, extraQuery = {}) {
            const query = Object.assign(Object.assign({}, extraQuery), { role: userEnums_1.UserRole.USER });
            if (isActive)
                query.isActive = isActive;
            if (search) {
                query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
            }
            return yield this._model.countDocuments(query);
        });
    }
    updateStatus(userId, isActive) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedDoc = yield this._model.findByIdAndUpdate(userId, { isActive }, { new: true });
            if (!updatedDoc)
                return null;
            return userMappers_1.UserMapper.fromMongooseDocument(updatedDoc);
        });
    }
    findAllTrainer() {
        return __awaiter(this, arguments, void 0, function* (skip = 0, limit = 10, isActive, search) {
            const query = { role: userEnums_1.UserRole.TRAINER };
            if (isActive) {
                query.isActive = isActive;
            }
            if (search) {
                query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
            }
            const docs = yield this._model.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
            return docs.map(doc => userMappers_1.UserMapper.fromMongooseDocument(doc));
        });
    }
    countTrainer(isActive_1, search_1) {
        return __awaiter(this, arguments, void 0, function* (isActive, search, extraQuery = {}) {
            const query = Object.assign(Object.assign({}, extraQuery), { role: userEnums_1.UserRole.TRAINER });
            if (isActive)
                query.isActive = isActive;
            if (search) {
                query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
            }
            return yield this._model.countDocuments(query);
        });
    }
    findByIdAndUpdatePassword(email, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._model.updateOne({ email }, { $set: { password: hashedPassword } });
        });
    }
    googleSignUp(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this._model.create(user);
            return doc._id.toString();
        });
    }
    updateStripeCustomerId(userId, stripeCustomerId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._model.findByIdAndUpdate(userId, { $set: { stripeCustomerId: stripeCustomerId } }, { new: true });
        });
    }
    updateActiveMembershipId(userId, activeMembershipId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._model.findByIdAndUpdate(userId, { $set: { activeMembershipId: activeMembershipId } }, { new: true });
        });
    }
    updateUserProfileImage(userId, profileImage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!profileImage)
                return;
            yield this._model.findByIdAndUpdate(userId, { $set: { profileImage: profileImage } });
        });
    }
    updateTrainerProfile(userId, profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedDoc = yield this._model.findByIdAndUpdate(userId, { $set: profile }, { new: true, upsert: true });
            if (!updatedDoc)
                return null;
            return userMappers_1.UserMapper.fromMongooseDocument(updatedDoc);
        });
    }
}
exports.UserRepository = UserRepository;
