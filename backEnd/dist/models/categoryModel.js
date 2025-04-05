"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    categoryName: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
exports.Category = (0, mongoose_1.model)("categories", categorySchema);
