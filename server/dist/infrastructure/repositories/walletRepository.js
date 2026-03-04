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
exports.WalletRepository = void 0;
const walletMapper_1 = require("../../application/mappers/walletMapper");
class WalletRepository {
    constructor(_model) {
        this._model = _model;
    }
    findByOwnerId(ownerId, ownerType) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this._model.findOne({ ownerId, ownerType });
            return doc ? walletMapper_1.WalletMapper.fromMongooseDocument(doc) : null;
        });
    }
    createWallet(ownerId, ownerType) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this._model.create({ ownerId, ownerType, balance: 0, transactions: [] });
            return walletMapper_1.WalletMapper.fromMongooseDocument(doc);
        });
    }
    getOrCreate(ownerId, ownerType) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield this.findByOwnerId(ownerId, ownerType);
            if (existing)
                return existing;
            return this.createWallet(ownerId, ownerType);
        });
    }
    credit(ownerId, ownerType, amount, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this._model.findOneAndUpdate({ ownerId, ownerType }, {
                $inc: { balance: amount },
                $push: { transactions: Object.assign(Object.assign({}, transaction), { createdAt: new Date() }) },
            }, { new: true, upsert: true });
            return walletMapper_1.WalletMapper.fromMongooseDocument(doc);
        });
    }
    debit(ownerId, ownerType, amount, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this._model.findOneAndUpdate({ ownerId, ownerType }, {
                $inc: { balance: -amount },
                $push: { transactions: Object.assign(Object.assign({}, transaction), { createdAt: new Date() }) },
            }, { new: true, upsert: true });
            return walletMapper_1.WalletMapper.fromMongooseDocument(doc);
        });
    }
}
exports.WalletRepository = WalletRepository;
