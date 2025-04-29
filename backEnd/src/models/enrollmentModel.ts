import { Schema, model } from "mongoose";
import { IEnrollment } from "../interfaces/database/IEnrollment";

export  interface IFinalAssessment {
  completed: boolean;
  score: number;
}

const enrollmentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "courses",
      required: true,
    },
    enrolledAt: {
      type: Schema.Types.Date,
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
        type: [Schema.Types.ObjectId],
        ref: "lessons",
        default: [],
      },
      finalAssessment: { 
        type: {
          completed: { type: Boolean, default: false },
          score: { type: Number, default: 0, min: 0, max: 100 },
        },
        default: { completed: false, score: 0 },
      },
      overallCompletionPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },
  },
  { timestamps: true }
);

export const enrollmentModel = model<IEnrollment>(
  "enrollments",
  enrollmentSchema
);
