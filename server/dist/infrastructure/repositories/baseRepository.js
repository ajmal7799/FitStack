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
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(_model, mapper) {
        this._model = _model;
        this.mapper = mapper;
    }
    save(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = this.mapper.toMongooseDocument(data);
            const saved = yield this._model.create(doc);
            return this.mapper.fromMongooseDocument(saved);
        });
    }
    findById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield this._model.findById(_id);
            if (!found)
                return null;
            return this.mapper.fromMongooseDocument(found);
        });
    }
}
exports.BaseRepository = BaseRepository;
