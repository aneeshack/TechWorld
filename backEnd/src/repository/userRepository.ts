import { IUserRepository } from "../interfaces/user/IUserRepository";
import { courseModel } from "../models/courseModel";
import { ICourse } from "../interfaces/courses/ICourse";
import UserModel from "../models/userModel";
import { enrollmentModel } from "../models/enrollmentModel";
import { IEnrollment } from "../interfaces/user/IEnrollment";
import mongoose from "mongoose";
import { CategoryEntity } from "../interfaces/courses/category";
import { Category } from "../models/categoryModel";

export class UserRepository implements IUserRepository {
  
  async getAllCourses(): Promise<ICourse[]> {
    try {

      const courses = await courseModel.find({ isPublished: true })
        .populate("category", "categoryName")
        .populate('instructor', 'userName')
        .exec();

        console.log('courses',courses)
        if(!courses){
          throw new Error('Courses not found')
        }

        return courses
    } catch (error) {
      console.log("user Repository error:get all courses", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async getSingleCourse(courseId: string): Promise<ICourse | null> {
    try {
      const course =  await courseModel.findOne({ _id: courseId, isPublished: true })
        .populate("category", "categoryName")
        .populate("instructor", "userName")
        .populate({
          path:'lessons',
          select: 'lessonNumber title thumbnail video ',
          options: {sort: {lessonNumber:1}}
        })
        .exec();

        console.log('course details',course)
        return course
    } catch (error) {
      console.log("user Repository error:get single course", error);
      throw new Error(`${(error as Error).message}`);
    }
  }


  async allCategories(): Promise<CategoryEntity[]> {
      try {
          const categories = await Category.find({isActive:true})

          return categories
      } catch (error) {
          console.log("user Repository error:getAll categories", error);
          throw new Error(` ${(error as Error).message}`);
      }
  }
  
  async enrollUser(userId: string, courseId: string,enrolledAt:Date, completionStatus:string ):Promise<IEnrollment>{
    try {
      const enrolled = new enrollmentModel({userId,courseId, enrolledAt,completionStatus });
      await enrolled.save()
      return  enrolled;
    } catch (error) {
      console.log("user Repository error: enroll course", error);
      throw new Error(`${(error as Error).message}`);
    }
  }


  async enrolledCourses(userId: string ):Promise<IEnrollment[]>{
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
          $project: {
            _id:1,
            userId:1,
            courseId:1,
            'courseDetails.title':1,
            "courseDetails.description": 1,
            "courseDetails.thumbnail": 1,
            "courseDetails.category": 1,
            "courseDetails.lessonCount": 1,
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

  // async createPaymentSession(data: any): Promise<any> {
  //   return {
  //     id: `session_${Math.random().toString(36).substr(2, 9)}`,
  //     ...data
  //   };
  // }
}
