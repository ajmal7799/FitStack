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
exports.TrainerSelectRepository = void 0;
const baseRepository_1 = require("./baseRepository");
const trainerSelectMappers_1 = require("../../application/mappers/trainerSelectMappers");
class TrainerSelectRepository extends baseRepository_1.BaseRepository {
    constructor(_model) {
        super(_model, trainerSelectMappers_1.TrainerSelectMapper);
        this._model = _model;
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield this._model.findOne({ userId: userId });
            if (!found)
                return null;
            return trainerSelectMappers_1.TrainerSelectMapper.fromMongooseDocument(found);
        });
    }
}
exports.TrainerSelectRepository = TrainerSelectRepository;
