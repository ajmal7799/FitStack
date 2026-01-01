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
exports.GoogleAuthService = void 0;
const config_1 = require("../config/config");
const error_1 = require("../../shared/constants/error");
const exceptions_1 = require("../../application/constants/exceptions");
const google_auth_library_1 = require("google-auth-library");
class GoogleAuthService {
    constructor() {
        this._oAuth2Client = new google_auth_library_1.OAuth2Client({
            client_id: config_1.CONFIG.GOOGLE_CLIENT_ID,
            client_secret: config_1.CONFIG.GOOGLE_CLIENT_SECERT,
            redirectUri: 'postmessage',
        });
    }
    authorize(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this._oAuth2Client.getToken(code);
            if (!token.tokens.id_token) {
                throw new exceptions_1.InvalidDataException(error_1.Errors.TOKEN_DATA_MISSING);
            }
            const ticket = yield this._oAuth2Client.verifyIdToken({
                idToken: token.tokens.id_token,
                audience: config_1.CONFIG.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!((payload === null || payload === void 0 ? void 0 : payload.email) && payload.sub && payload.picture && payload.name)) {
                throw new exceptions_1.InvalidDataException(error_1.Errors.TOKEN_DATA_MISSING);
            }
            return { email: payload.email, googleId: payload.sub, name: payload.name };
        });
    }
}
exports.GoogleAuthService = GoogleAuthService;
