"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoCallController = exports.findExpiredSessionUseCase = void 0;
const videoCallRepository_1 = require("../../repositories/videoCallRepository");
const videoCallModel_1 = require("../../database/models/videoCallModel");
const userRepository_1 = require("../../repositories/userRepository");
const userModel_1 = require("../../database/models/userModel");
const videoCallController_1 = require("../../../interfaceAdapters/controller/video/videoCallController");
const JoinSessionUseCase_1 = require("../../../application/implementation/Video/JoinSessionUseCase");
const slotRepository_1 = require("../../repositories/slotRepository");
const slotModel_1 = require("../../database/models/slotModel");
const FindExpiredSessionUseCase_1 = require("../../../application/implementation/Video/FindExpiredSessionUseCase");
// Repostitory & Services
const videoCallRepository = new videoCallRepository_1.VideoCallRepository(videoCallModel_1.videoCallModel);
const userRepository = new userRepository_1.UserRepository(userModel_1.userModel);
const slotRepository = new slotRepository_1.SlotRepository(slotModel_1.slotModel);
// useCases
const joinSessionUseCase = new JoinSessionUseCase_1.JoinSessionUseCase(slotRepository, videoCallRepository);
exports.findExpiredSessionUseCase = new FindExpiredSessionUseCase_1.FindExpiredSessionUseCase(videoCallRepository, slotRepository);
//controllers
exports.videoCallController = new videoCallController_1.VideoCallController(joinSessionUseCase);
