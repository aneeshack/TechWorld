import { IUserRepository } from "../interfaces/user/IUserRepository";
import { courseModel } from "../models/courseModel";
import { ICourse } from "../interfaces/courses/ICourse";
import UserModel from "../models/userModel";
import { enrollmentModel } from "../models/enrollmentModel";
import { IEnrollment } from "../interfaces/database/IEnrollment";
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

        if(!courses){
          throw new Error('Courses not found')
        }

        return courses
    } catch (error) {
      console.error("user Repository error:get all courses", error);
      throw new Error(`${(error as Error).message}`);
    }
  }
  async findCourses(
    searchTerm: string = "",
    categoryIds: string[] = [],
    priceMin?: number,
    priceMax?: number,
    sortOrder: "asc" | "desc" | "" = "",
    page: number = 1,
    limit: number = 10
  ): Promise<{ courses: ICourse[]; total: number }> {
    const query: any = {isPublished: true};
  
    if (searchTerm) {
      query.title = { $regex: searchTerm, $options: "i" };
    }
  
    if (categoryIds.length > 0) {
      query.category = { $in: categoryIds };
    }
  
    if (priceMin !== undefined || priceMax !== undefined) {
      query.price = {};
      if (priceMin !== undefined) query.price.$gte = priceMin;
      if (priceMax !== undefined) query.price.$lte = priceMax;
    }
  
    const sort: any = {};
    if (sortOrder === "asc" || sortOrder === "desc") {
      sort.price = sortOrder === "asc" ? 1 : -1;
    }
  
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
  
    // Execute query with pagination
    const courses = await courseModel
      .find(query)
      .populate("category", "categoryName")
      .populate("instructor", "userName")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
  
    // Get total count of matching documents
    const total = await courseModel.countDocuments(query);
  
    return { courses, total };
  }



  async getSingleCourse(courseId: string): Promise<ICourse | null> {
    try {
      const course =  await courseModel.findOne({ _id: courseId, isPublished: true })
        .populate("category", "categoryName")
        .populate("instructor", "userName")
        .populate({
          path:'lessons',
          select: 'lessonNumber title thumbnail description ',
          options: {sort: {lessonNumber:1}}
        })
        .exec();

        return course
    } catch (error) {
      console.error("user Repository error:get single course", error);
      throw new Error(`${(error as Error).message}`);
    }
  }


  async allCategories(): Promise<CategoryEntity[]> {
      try {
          const categories = await Category.find({isActive:true})

          return categories
      } catch (error) {
          console.error("user Repository error:getAll categories", error);
          throw new Error(` ${(error as Error).message}`);
      }
  }
  
  async enrollUser(userId: string, courseId: string,enrolledAt:Date, completionStatus:string ):Promise<IEnrollment>{
    try {
      const enrolled = new enrollmentModel({userId,courseId, enrolledAt,completionStatus });
      await enrolled.save()
      return  enrolled;
    } catch (error) {
      console.error("user Repository error: enroll course", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

}
