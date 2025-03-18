import mongoose from "mongoose";
import { IStudentRepository } from "../interfaces/student/IStudentRepository";
import { IUser } from "../interfaces/database/IUser";
import UserModel from "../models/userModel";
import { IPayment } from "../interfaces/courses/IPayment";
import { paymentModel } from "../models/paymentModel";
import { IEnrollment } from "../interfaces/database/IEnrollment";
import { enrollmentModel } from "../models/enrollmentModel";

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
            console.log('payment',payments)
            return payments
        } catch (error) {
            console.error("Error updating student profile:", error);
            throw new Error("Failed to update student profile");
        }
    }

     async enrolledCourses(userId: string ):Promise<IEnrollment[] | null>{
        try {
          // const enrolledCourses = await enrollmentModel.find({userId:userId})
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
    
          console.log('enrolled course',enrolledCourses)
          return  enrolledCourses;
    
        } catch (error) {
          console.log("user Repository error: enrolled courses", error);
          throw new Error(`${(error as Error).message}`);
        }
      }
    
      async studentCourseEnrollment(userId: string, courseId: string): Promise<IEnrollment| null> {
        try {
              const enrollment = await enrollmentModel
                  .findOne({ userId, courseId })
                  .populate("courseId") 
                  .populate("progress.completedLessons"); 
                  console.log('enrollment',enrollment)
              return enrollment
        } catch (error) {
            console.error("Error fetch student course enrollment:", error);
            throw new Error("Failed to fetch student course enrollment");
        }
    }
}