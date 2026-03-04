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
exports.FeedbackRepository = void 0;
const feedbackMappers_1 = require("../../application/mappers/feedbackMappers");
const baseRepository_1 = require("./baseRepository");
class FeedbackRepository extends baseRepository_1.BaseRepository {
    constructor(_model) {
        super(_model, feedbackMappers_1.FeedbackMapper);
        this._model = _model;
    }
    findBySessionId(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = yield this._model.findOne({ sessionId });
            return feedback ? feedbackMappers_1.FeedbackMapper.fromMongooseDocument(feedback) : null;
        });
    }
}
exports.FeedbackRepository = FeedbackRepository;
