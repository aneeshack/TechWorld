"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenModel = void 0;
const mongoose_1 = require("mongoose");
const tokenSchema = new mongoose_1.Schema({
    userId: {
        type: String,
    },
    token: {
        type: String,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 0, // TTL Index: MongoDB will delete expired tokens automatically
    },
});
exports.tokenModel = (0, mongoose_1.model)("tokens", tokenSchema);
