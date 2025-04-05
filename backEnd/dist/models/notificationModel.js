"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationModel = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    recipient: {
        type: mongoose_1.Types.ObjectId,
        ref: "users",
        required: true,
    },
    sender: {
        type: mongoose_1.Types.ObjectId,
        ref: "users",
        required: true,
    },
    message: {
        type: mongoose_1.Types.ObjectId,
        ref: "messages",
        required: true,
    },
    chat: {
        type: mongoose_1.Types.ObjectId,
        ref: "chats",
        required: true,
    },
    isSeen: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.notificationModel = (0, mongoose_1.model)("notifications", notificationSchema);
