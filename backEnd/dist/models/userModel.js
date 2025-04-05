"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const IUser_1 = require("../interfaces/database/IUser");
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false,
    },
    userName: {
        type: String,
        required: true,
    },
    profile: {
        type: Object,
    },
    contact: {
        type: Object,
    },
    profession: {
        type: String,
    },
    qualification: {
        type: String,
    },
    cv: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        enum: Object.values(IUser_1.Role),
    },
    profit: {
        type: String,
    },
    isGoogleAuth: {
        type: Boolean,
        default: false,
    },
    requestStatus: {
        type: Object,
    },
    isRequested: {
        type: Boolean,
        default: false,
    },
    isOtpVerified: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    lastLoginDate: {
        type: Date,
    },
    loginStreak: {
        type: Number,
    },
}, { timestamps: true });
const UserModel = (0, mongoose_1.model)('users', UserSchema);
exports.default = UserModel;
