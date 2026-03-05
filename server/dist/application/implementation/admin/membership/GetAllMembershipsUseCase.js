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
exports.GetAllMembershipsUseCase = void 0;
class GetAllMembershipsUseCase {
    constructor(_membershipRepository, _storageService) {
        this._membershipRepository = _membershipRepository;
        this._storageService = _storageService;
    }
    execute(page, limit, status, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const [memberships, totalMemberships] = yield Promise.all([
                this._membershipRepository.findAllForAdmin(skip, limit, status, search),
                this._membershipRepository.countAllForAdmin(status, search),
            ]);
            // ✅ Resolve all signed URLs in parallel
            const mappedMemberships = yield Promise.all(memberships.map((item) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                return ({
                    _id: item.membership._id,
                    userName: (_b = (_a = item.user) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : 'Unknown User',
                    planName: (_d = (_c = item.subscription) === null || _c === void 0 ? void 0 : _c.planName) !== null && _d !== void 0 ? _d : 'Unknown Plan',
                    price: (_f = (_e = item.subscription) === null || _e === void 0 ? void 0 : _e.price) !== null && _f !== void 0 ? _f : 0,
                    durationMonths: (_h = (_g = item.subscription) === null || _g === void 0 ? void 0 : _g.durationMonths) !== null && _h !== void 0 ? _h : 0,
                    status: item.membership.status,
                    currentPeriodEnd: item.membership.currentPeriodEnd,
                    profileImage: ((_j = item.user) === null || _j === void 0 ? void 0 : _j.profileImage)
                        ? yield this._storageService.createSignedUrl(item.user.profileImage, 10 * 60)
                        : null,
                });
            })));
            return {
                memberships: mappedMemberships,
                totalMemberships,
                totalPages: Math.ceil(totalMemberships / limit),
                currentPage: page,
            };
        });
    }
}
exports.GetAllMembershipsUseCase = GetAllMembershipsUseCase;
