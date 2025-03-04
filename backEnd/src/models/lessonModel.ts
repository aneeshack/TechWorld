import mongoose, { model, Schema } from "mongoose";
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

const lessonSchema = new Schema<ILesson>({
  lessonNumber: {
    type: Number,
  },
  title: {
    type: String,
    required: true,
  },
  thumbnail:{
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
    required: false
  },
  pdf: {
    type: String,
    required: false
  },
  isTrial: {
    type: Boolean,
    default: false,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref:'courses',
    required: true
  },
  assessment: [{
    type: assessmentSchema,
    required: false
  }]
});

lessonSchema.pre<ILesson>("save", async function (next) {
  const lessonModel = mongoose.model<ILesson>("lessons");
  if (!this.lessonNumber) {
    try {
      const lastLesson = await lessonModel.findOne({course: this.course}).sort({ lessonNumber: -1 });
      this.lessonNumber = lastLesson ? lastLesson.lessonNumber + 1 : 1; // Start from 1 if no lessons exist 
      next();   
    } catch (error) {
      next(error as mongoose.CallbackError)
    }
  }else{
    next()
  }
  
});
export const lessonModel = model<ILesson>("lessons", lessonSchema);
