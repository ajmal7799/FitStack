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
exports.MembershipRepository = void 0;
const baseRepository_1 = require("./baseRepository");
const membershipMappers_1 = require("../../application/mappers/membershipMappers");
const subscriptionMappers_1 = require("../../application/mappers/subscriptionMappers");
class MembershipRepository extends baseRepository_1.BaseRepository {
    constructor(_model) {
        super(_model, membershipMappers_1.MembershipMapper);
        this._model = _model;
    }
    findBySubscriptionId(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const membershipDoc = yield this._model.findOne({ subscriptionId: subscriptionId });
            if (!membershipDoc) {
                return null;
            }
            return membershipMappers_1.MembershipMapper.fromMongooseDocument(membershipDoc);
        });
    }
    updateStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedDoc = yield this._model.findOneAndUpdate({ _id: id }, { $set: { status: status } }, { new: true });
            if (!updatedDoc)
                return null;
            return membershipMappers_1.MembershipMapper.fromMongooseDocument(updatedDoc);
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const membershipDoc = yield this._model.findOne({ userId: userId });
            if (!membershipDoc) {
                return null;
            }
            return membershipMappers_1.MembershipMapper.fromMongooseDocument(membershipDoc);
        });
    }
    findActiveMembershipsWithSubscription(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const pipeline = [];
            pipeline.push({
                $match: { userId: userId }
            }, {
                $lookup: {
                    from: 'subscriptions',
                    localField: 'planId',
                    foreignField: '_id',
                    as: 'subscriptionData',
                },
            }, {
                $unwind: {
                    path: '$subscriptionData',
                    preserveNullAndEmptyArrays: true,
                },
            });
            const results = yield this._model.aggregate(pipeline);
            return results.map((result) => ({
                membership: membershipMappers_1.MembershipMapper.fromMongooseDocument(result),
                subscription: subscriptionMappers_1.SubscriptionMapper.fromMongooseDocument(result.subscriptionData),
            }));
        });
    }
}
exports.MembershipRepository = MembershipRepository;
