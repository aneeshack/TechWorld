import { model, Schema } from "mongoose";
import { IAssessment, ILesson } from "../interfaces/courses/ILesson";

const assessmentSchema = new Schema<IAssessment>({
    question: { type: String, required: false },
    options: [
      {
        text: { type: String, required: false },
        isCorrect: { type: Boolean, required: false },
      },
    ],
  });

const lessonSchema = new Schema({
  lessonNumber: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
  },
  pdf: {
    type: String,
  },
  isTrial: {
    type: Boolean,
    default: false,
  },
  assessment: {
    type: assessmentSchema,
    required: false
  }
});
export const lessonModel = model<ILesson>("lessons", lessonSchema);
