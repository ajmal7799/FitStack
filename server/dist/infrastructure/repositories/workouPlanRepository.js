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
exports.WorkoutPlanRepository = void 0;
const baseRepository_1 = require("./baseRepository");
const workouPlanMappers_1 = require("../../application/mappers/workouPlanMappers");
class WorkoutPlanRepository extends baseRepository_1.BaseRepository {
    constructor(_model) {
        super(_model, workouPlanMappers_1.WorkoutPlanMapper);
        this._model = _model;
    }
    saveWorkoutPlan(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedDocs = yield this._model.findOneAndUpdate({ userId: userId }, { $set: data }, { new: true, upsert: true });
            if (!updatedDocs)
                return null;
            return workouPlanMappers_1.WorkoutPlanMapper.fromMongooseDocument(updatedDocs);
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const workoutPlan = yield this._model.findOne({ userId: userId });
            if (!workoutPlan)
                return null;
            return workouPlanMappers_1.WorkoutPlanMapper.fromMongooseDocument(workoutPlan);
        });
    }
}
exports.WorkoutPlanRepository = WorkoutPlanRepository;
