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
exports.GetAllSubscription = void 0;
const subscriptionMappers_1 = require("../../../mappers/subscriptionMappers");
class GetAllSubscription {
    constructor(_subscriptionRepository) {
        this._subscriptionRepository = _subscriptionRepository;
    }
    getAllSubscription(page, limit, status, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const [subscriptions, totalSubscriptions] = yield Promise.all([
                this._subscriptionRepository.findAllSubscriptions(skip, limit, status, search),
                this._subscriptionRepository.countSubscriptions(status, search),
            ]);
            const subscriptionDTOs = subscriptions.map((subscription) => subscriptionMappers_1.SubscriptionMapper.toDTO(subscription));
            return {
                subscriptions: subscriptionDTOs,
                totalSubscriptions,
                totalPages: Math.ceil(totalSubscriptions / limit),
                currentPage: page,
            };
        });
    }
}
exports.GetAllSubscription = GetAllSubscription;
