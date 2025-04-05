"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatModel = void 0;
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    isGroupChat: {
        type: Boolean,
        default: false
    },
    users: [{
            type: mongoose_1.Types.ObjectId,
            ref: "users",
            required: true
        }],
    latestMessage: {
        type: mongoose_1.Types.ObjectId,
        ref: "messages"
    },
    groupName: {
        type: String
    },
    groupAdmin: {
        type: mongoose_1.Types.ObjectId,
        ref: "users"
    },
}, {
    timestamps: true
});
exports.chatModel = (0, mongoose_1.model)("chats", chatSchema);
