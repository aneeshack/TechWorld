import mongoose, { model, Schema } from "mongoose";
import { ICourse } from "../interfaces/courses/ICourse";
import { IAssessment } from "../interfaces/courses/ILesson";

const assessmentSchema = new Schema<IAssessment>({
  question: { type: String, required: true },
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
});

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    instructor: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    language: {
      type: String,
      default: "english",
    },
    duration: {
      type: String,
      required: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    lessons: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'lessons',
            default:[]
        }
    ],
    rating: {
      type: Number,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    finalAssessment: [
      {
        type: assessmentSchema,
        required: true, // Final assessment is mandatory
      },
    ],
  },
  { timestamps: true }
);

export const courseModel = model<ICourse>("courses", courseSchema);
