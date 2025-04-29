import { Types, Document } from "mongoose";
import { IFinalAssessment } from "../../models/enrollmentModel";

export interface IEnrollment extends Document {
  _id:string;
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  enrolledAt?: Date;
  completionStatus: "enrolled" | "in-progress" | "completed";
  progress: {
    completedLessons: Types.ObjectId[];
    finalAssessment: IFinalAssessment;
    overallCompletionPercentage: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
