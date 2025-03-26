import mongoose from "mongoose";
import { IStudentRepository } from "../interfaces/student/IStudentRepository";
import { IUser } from "../interfaces/database/IUser";
import UserModel from "../models/userModel";
import { IPayment } from "../interfaces/courses/IPayment";
import { paymentModel } from "../models/paymentModel";
import { IEnrollment } from "../interfaces/database/IEnrollment";
import { enrollmentModel } from "../models/enrollmentModel";
import { IReview } from "../interfaces/database/IReview";
import { reviewModel } from "../models/reviewModel";
import { courseModel } from "../models/courseModel";

export class StudentRepository implements IStudentRepository{

    async getStudentProfile(userId: string): Promise<IUser | null> {
        try {
            return await UserModel.findById(userId);
        } catch (error) {
            console.error("Error fetching student profile:", error);
            throw new Error("Failed to fetch student profile");
        }
    }

    async updateStudent(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
        try {
            return UserModel.findOneAndUpdate(
              { _id: new mongoose.Types.ObjectId(userId), role: 'student' },
              { $set: updateData },
              { new: true } // Return the updated document
            ).exec();
        } catch (error) {
            console.error("Error updating student profile:", error);
            throw new Error("Failed to update student profile");
        }
    }

    async fetchPayment(userId: string): Promise<IPayment[] | null> {
        try {
          const payments = await paymentModel
                        .find({userId})
                        .populate('courseId','title')
            return payments
        } catch (error) {
            console.error("Error updating student profile:", error);
            throw new Error("Failed to update student profile");
        }
    }

     async enrolledCourses(userId: string ):Promise<IEnrollment[] | null>{
        try {
          const enrolledCourses = await enrollmentModel.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
              $lookup:{
                from:'courses',
                localField: 'courseId',
                foreignField:'_id',
                as:'courseDetails'
              }
            },
            {
              $unwind:'$courseDetails'
            },
            {
                $lookup:{
                    from: 'categories',
                    localField: 'courseDetails.category',
                    foreignField: '_id',
                    as:'courseDetails.category'
                }
            },
            {
                $unwind:'$courseDetails.category'
            },
            {
                $lookup:{
                    from: 'users',
                    localField: 'courseDetails.instructor',
                    foreignField: '_id',
                    as:'courseDetails.instructor'
                }
            },
            {
                $unwind:'$courseDetails.instructor'
            },
            {
              $project: {
                _id:1,
                userId:1,
                courseId:1,
                enrolledAt:1,
                completionStatus:1,
                progress:1,
                'courseDetails.title':1,
                "courseDetails.description": 1,
                "courseDetails.thumbnail": 1,
                "courseDetails.category": 1,
                "courseDetails.lessonCount": 1,
                "courseDetails.instructor._id" :1,
                "courseDetails.instructor.userName":1,
                "courseDetails.instructor.profile.avatar":1,
              }
            }
          ])
    
          return  enrolledCourses;
    
        } catch (error) {
          console.error("user Repository error: enrolled courses", error);
          throw new Error(`${(error as Error).message}`);
        }
      }
    
      async studentCourseEnrollment(userId: string, courseId: string): Promise<IEnrollment| null> {
        try {
              const enrollment = await enrollmentModel
                  .findOne({ userId, courseId })
                  .populate("courseId") 
                  .populate("progress.completedLessons"); 
              return enrollment
        } catch (error) {
            console.error("Error fetch student course enrollment:", error);
            throw new Error("Failed to fetch student course enrollment");
        }
    }

    async getReview(studentId: string, courseId: string): Promise<IReview| null> {
      try {
        if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(courseId)) {
          throw new Error("Invalid studentId or courseId");
        }
        return await reviewModel.findOne({ studentId, courseId }).exec();
      } catch (error) {
          console.error("Error in getting the review:", error);
          throw new Error("rror in getting the review:");
      }
  }

  // Helper function to update course rating
  private async updateCourseRating(courseId: string): Promise<void> {
    const ratingStats = await reviewModel.aggregate([
      { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },
      {
        $group: {
          _id: "$courseId",
          averageRating: { $avg: "$rating" }, // Calculate average
        },
      },
    ]);

    const averageRating = ratingStats.length > 0 ? ratingStats[0].averageRating : 0;

    await courseModel.updateOne(
      { _id: courseId },
      { $set: { rating: Number(averageRating.toFixed(1)) } } // Store as a number with 1 decimal
    );
  }

    async createReview(studentId: string, courseId: string, rating: string, reviewText:string): Promise<IReview| null> {
      try {
        if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(courseId)) {
          throw new Error("Invalid studentId or courseId");
        }
        const newReview = await reviewModel.create({
          studentId,
          courseId,
          rating,
          reviewText,
        });

        await this.updateCourseRating(courseId);
        return newReview;
      } catch (error) {
          console.error("Error create the review:", error);
          throw new Error("Failed create course review");
      }
  }

  async updateReview(studentId: string, courseId: string, rating: string, reviewText:string): Promise<IReview| null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(courseId)) {
        throw new Error("Invalid studentId or courseId");
      }
      const updatedReview = await reviewModel.findOneAndUpdate(
        { studentId, courseId },
        { rating, reviewText },
        { new: true, runValidators: true } // Returns updated document, applies schema validation
      );
      if (!updatedReview) {
        throw new Error("Review not found for update");
      }

      await this.updateCourseRating(courseId);
      
      return updatedReview;
    } catch (error) {
        console.error("Error update the review:", error);
        throw new Error("Failed student course review");
    }
}
}