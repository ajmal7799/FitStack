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
exports.TrainerSelectUseCase = void 0;
const exceptions_1 = require("../../../constants/exceptions");
const error_1 = require("../../../../shared/constants/error");
const trainerSelectMappers_1 = require("../../../mappers/trainerSelectMappers");
class TrainerSelectUseCase {
    constructor(_trainerSelectRepository, _userRepository) {
        this._trainerSelectRepository = _trainerSelectRepository;
        this._userRepository = _userRepository;
    }
    selectTrainer(userId, trainerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const trainer = yield this._userRepository.findById(trainerId);
            if (!trainer) {
                throw new exceptions_1.NotFoundException(error_1.TRAINER_ERRORS.TRAINER_NOT_FOUND);
            }
            const existingSelection = yield this._trainerSelectRepository.findByUserId(userId);
            if (existingSelection) {
                throw new exceptions_1.AlreadyExisitingExecption(error_1.USER_ERRORS.TRAINER_ALREADY_SELECTED);
            }
            const trainerSelectionEntities = trainerSelectMappers_1.TrainerSelectMapper.toEntity(userId, trainerId);
            yield this._trainerSelectRepository.save(trainerSelectionEntities);
        });
    }
}
exports.TrainerSelectUseCase = TrainerSelectUseCase;
