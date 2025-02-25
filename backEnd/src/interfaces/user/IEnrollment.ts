import { Types, Document } from "mongoose";

export interface IEnrollment extends Document {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  enrolledAt?: Date;
  completionStatus: "enrolled" | "in-progress" | "completed";
  progress: {
    completedLessons: Types.ObjectId[];
    completedAssessments: Types.ObjectId[];
    overallCompletionPercentage: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
