"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletMapper = void 0;
class WalletMapper {
    static fromMongooseDocument(doc) {
        return {
            _id: doc._id.toString(),
            ownerId: doc.ownerId.toString(),
            ownerType: doc.ownerType,
            balance: doc.balance,
            transactions: doc.transactions.map((t) => {
                var _a;
                return ({
                    _id: t._id.toString(),
                    type: t.type,
                    amount: t.amount,
                    description: t.description,
                    relatedId: (_a = t.relatedId) === null || _a === void 0 ? void 0 : _a.toString(),
                    createdAt: t.createdAt,
                });
            }),
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
}
exports.WalletMapper = WalletMapper;
