"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentModel = void 0;
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'courses',
        required: true,
    },
    method: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        required: true,
    },
    type: {
        type: String,
        enum: ["credit", "debit"],
        required: false,
    },
    amount: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});
exports.paymentModel = (0, mongoose_1.model)("payments", paymentSchema);
