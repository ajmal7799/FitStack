"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenSerivce = void 0;
const uuid_1 = require("uuid");
class TokenSerivce {
    createToken() {
        return (0, uuid_1.v4)();
    }
}
exports.TokenSerivce = TokenSerivce;
