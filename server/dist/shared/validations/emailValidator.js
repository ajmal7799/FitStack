"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailSchema = void 0;
const zod_1 = require("zod");
exports.emailSchema = zod_1.z.string().email('Invalid email address');
