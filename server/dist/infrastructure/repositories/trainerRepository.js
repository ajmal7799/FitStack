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
exports.TrainerRepository = void 0;
const baseRepository_1 = require("./baseRepository");
const trainerMappers_1 = require("../../application/mappers/trainerMappers");
class TrainerRepository extends baseRepository_1.BaseRepository {
    constructor(_model) {
        super(_model, trainerMappers_1.TrainerMapper);
        this._model = _model;
        // Initialization code here
    }
    profileCompletion(trainerId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedDoc = yield this._model.findOneAndUpdate({ trainerId: trainerId }, { $set: data }, { new: true, upsert: true });
            if (!updatedDoc)
                return null;
            return trainerMappers_1.TrainerMapper.fromMongooseDocument(updatedDoc);
        });
    }
    findByTrainerId(trainerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const trainerDoc = yield this._model.findOne({ trainerId: trainerId });
            if (!trainerDoc) {
                return null;
            }
            return trainerMappers_1.TrainerMapper.fromMongooseDocument(trainerDoc);
        });
    }
    updateTrainerProfile(trainerId, profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedDoc = yield this._model.findOneAndUpdate({ _id: trainerId }, { $set: profile }, { new: true, upsert: true });
            if (!updatedDoc)
                return null;
            return trainerMappers_1.TrainerMapper.fromMongooseDocument(updatedDoc);
        });
    }
}
exports.TrainerRepository = TrainerRepository;
