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
exports.SubscriptionRepository = void 0;
const baseRepository_1 = require("./baseRepository");
const subscriptionMappers_1 = require("../../application/mappers/subscriptionMappers");
const subscriptionStatus_1 = require("../../domain/enum/subscriptionStatus");
class SubscriptionRepository extends baseRepository_1.BaseRepository {
    constructor(_model) {
        super(_model, subscriptionMappers_1.SubscriptionMapper);
        this._model = _model;
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalized = name.trim().toUpperCase();
            const doc = yield this._model.findOne({ planName: normalized });
            if (!doc)
                return null;
            return subscriptionMappers_1.SubscriptionMapper.fromMongooseDocument(doc);
        });
    }
    findAllSubscriptions() {
        return __awaiter(this, arguments, void 0, function* (skip = 0, limit = 10, status, search) {
            const query = {};
            if (status) {
                query.isActive = status;
            }
            if (search) {
                query.planName = { $regex: search, $options: 'i' };
            }
            const docs = yield this._model
                .find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });
            return docs.map((doc) => subscriptionMappers_1.SubscriptionMapper.fromMongooseDocument(doc));
        });
    }
    countSubscriptions(status_1, search_1) {
        return __awaiter(this, arguments, void 0, function* (status, search, extraQuery = {}) {
            const query = Object.assign({}, extraQuery);
            if (status) {
                query.isActive = status;
            }
            if (search) {
                query.planName = { $regex: search, $options: 'i' };
            }
            return yield this._model.countDocuments(query);
        });
    }
    updateStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this._model.findOneAndUpdate({ _id: id }, { isActive: status }, { new: true });
            if (!doc)
                return null;
            return subscriptionMappers_1.SubscriptionMapper.fromMongooseDocument(doc);
        });
    }
    findAllSubscriptionsInUserSide() {
        return __awaiter(this, arguments, void 0, function* (skip = 0, limit = 10) {
            const query = { isActive: subscriptionStatus_1.SubscriptionStatus.ACTIVE };
            const docs = yield this._model
                .find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });
            return docs.map((doc) => subscriptionMappers_1.SubscriptionMapper.fromMongooseDocument(doc));
        });
    }
    countSubscriptionsInUserSide() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { isActive: subscriptionStatus_1.SubscriptionStatus.ACTIVE };
            return yield this._model.countDocuments(query);
        });
    }
    findByIdAndUpdate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this._model.findOneAndUpdate({ _id: data._id }, data, { new: true });
            if (!doc)
                return null;
            return subscriptionMappers_1.SubscriptionMapper.fromMongooseDocument(doc);
        });
    }
}
exports.SubscriptionRepository = SubscriptionRepository;
