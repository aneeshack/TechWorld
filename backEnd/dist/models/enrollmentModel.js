"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollmentModel = void 0;
const mongoose_1 = require("mongoose");
const enrollmentSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "courses",
        required: true,
    },
    enrolledAt: {
        type: mongoose_1.Schema.Types.Date,
        default: function () {
            return Date.now();
        },
    },
    completionStatus: {
        type: String,
        enum: ["enrolled", "in-progress", "completed"],
        default: "enrolled",
    },
    progress: {
        completedLessons: {
            type: [mongoose_1.Schema.Types.ObjectId],
            ref: "lessons",
            default: [],
        },
        completedAssessments: {
            type: [mongoose_1.Schema.Types.ObjectId],
            default: [],
        },
        overallCompletionPercentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
    },
}, { timestamps: true });
exports.enrollmentModel = (0, mongoose_1.model)("enrollments", enrollmentSchema);
