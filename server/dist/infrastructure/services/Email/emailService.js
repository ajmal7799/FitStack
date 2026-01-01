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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../../config/config");
class EmailService {
    constructor() {
        this._transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: config_1.CONFIG.GOOGLE_MAIL,
                pass: config_1.CONFIG.GOOGLE_APP_PASSWORD,
            },
        }, {
            from: config_1.CONFIG.GOOGLE_MAIL,
        });
        this._transporter
            .verify()
            .then(() => console.log('Gmail connection established '))
            .catch((err) => console.log('Gmail connection failed', err));
    }
    sendEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`Email sent to : ${email.receiverEmail}`);
                yield this._transporter.sendMail({
                    to: email.receiverEmail,
                    subject: email.subject,
                    html: email.content,
                });
            }
            catch (error) {
                console.error('Error while sending email : ', error);
                throw error;
            }
        });
    }
}
exports.EmailService = EmailService;
