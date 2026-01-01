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
exports.KeyValueTTLCaching = void 0;
const redis_1 = require("redis");
const config_1 = require("../../config/config");
class KeyValueTTLCaching {
    constructor() {
        this._redisClient = (0, redis_1.createClient)({
            url: config_1.CONFIG.REDIS_URL || 'redis://127.0.0.1:6379',
        });
        this._redisClient.on('error', (err) => console.error('Error occured on redis database : ', err));
        this._redisClient.on('connect', () => console.log('Redis Connected Successfully '));
        this._redisClient.on('ready', () => console.log('Redis Client Ready'));
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._redisClient.isOpen) {
                yield this._redisClient.connect();
            }
        });
    }
    setData(key, time, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._redisClient.isOpen) {
                yield this.connect();
            }
            this._redisClient.setEx(key, time, value);
        });
    }
    getData(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._redisClient.isOpen) {
                yield this.connect();
            }
            return yield this._redisClient.get(key);
        });
    }
    deleteData(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._redisClient.isOpen) {
                yield this.connect();
            }
            yield this._redisClient.del(key);
        });
    }
}
exports.KeyValueTTLCaching = KeyValueTTLCaching;
