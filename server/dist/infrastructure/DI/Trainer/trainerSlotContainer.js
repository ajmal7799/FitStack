"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainerSlotController = void 0;
const trainerSlotController_1 = require("../../../interfaceAdapters/controller/trainer/trainerSlotController");
const createSlotUseCase_1 = require("../../../application/implementation/trainer/slot/createSlotUseCase");
const userRepository_1 = require("../../repositories/userRepository");
const userModel_1 = require("../../database/models/userModel");
const slotRepository_1 = require("../../repositories/slotRepository");
const slotModel_1 = require("../../database/models/slotModel");
const getAllSlotsUseCase_1 = require("../../../application/implementation/trainer/slot/getAllSlotsUseCase");
const deleteSlotUseCase_1 = require("../../../application/implementation/trainer/slot/deleteSlotUseCase");
const recurringSlotUseCase_1 = require("../../../application/implementation/trainer/slot/recurringSlotUseCase");
const getBookedSlotUseCase_1 = require("../../../application/implementation/trainer/slot/getBookedSlotUseCase");
const bookedSlotDetailsUseCase_1 = require("../../../application/implementation/trainer/slot/bookedSlotDetailsUseCase");
const storageService_1 = require("../../services/Storage/storageService");
const sessionHistoryUseCase_1 = require("../../../application/implementation/trainer/slot/sessionHistoryUseCase");
const videoCallRepository_1 = require("../../repositories/videoCallRepository");
const videoCallModel_1 = require("../../database/models/videoCallModel");
const sessionHistoryDetailsUseCase_1 = require("../../../application/implementation/trainer/slot/sessionHistoryDetailsUseCase");
const feedbackRepository_1 = require("../../repositories/feedbackRepository");
const feedbackModel_1 = require("../../database/models/feedbackModel");
// Respositories & Services
const userRepository = new userRepository_1.UserRepository(userModel_1.userModel);
const slotRepository = new slotRepository_1.SlotRepository(slotModel_1.slotModel);
const videoCallRepository = new videoCallRepository_1.VideoCallRepository(videoCallModel_1.videoCallModel);
const storageService = new storageService_1.StorageService();
const feedbackRepository = new feedbackRepository_1.FeedbackRepository(feedbackModel_1.feedbackModel);
// Use Cases
const createSlotUseCase = new createSlotUseCase_1.CreateSlotUseCase(userRepository, slotRepository);
const getAllSlots = new getAllSlotsUseCase_1.GetAllSlotsUseCase(userRepository, slotRepository);
const deleteSlotUseCase = new deleteSlotUseCase_1.DeleteSlotUseCase(slotRepository);
const recurringSlotUseCase = new recurringSlotUseCase_1.RecurringSlotUseCase(userRepository, slotRepository);
const bookedSlotsUseCase = new getBookedSlotUseCase_1.BookedSlotsUseCase(videoCallRepository, userRepository, storageService);
const bookedSlotDetailsUseCase = new bookedSlotDetailsUseCase_1.BookedSlotDetailsUseCase(videoCallRepository, userRepository, storageService);
const sessionHistoryUseCase = new sessionHistoryUseCase_1.SessionHistoryUseCase(videoCallRepository, userRepository, feedbackRepository);
const sessionHistoryDetailsUseCase = new sessionHistoryDetailsUseCase_1.SessionHistoryDetailsUseCase(videoCallRepository, userRepository, storageService, feedbackRepository);
// Controllers
exports.trainerSlotController = new trainerSlotController_1.TrainerSlotController(createSlotUseCase, getAllSlots, deleteSlotUseCase, recurringSlotUseCase, bookedSlotsUseCase, bookedSlotDetailsUseCase, sessionHistoryUseCase, sessionHistoryDetailsUseCase);
