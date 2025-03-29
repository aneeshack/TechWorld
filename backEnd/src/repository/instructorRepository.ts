import mongoose from "mongoose";
import { CategoryEntity } from "../interfaces/courses/category";
import { ICourse } from "../interfaces/courses/ICourse";
import { IAssessment, ILesson } from "../interfaces/courses/ILesson";
import { IInstructorRepository } from "../interfaces/instructor/IInstructorRepository";
import { Category } from "../models/categoryModel";
import { courseModel } from "../models/courseModel";
import { lessonModel } from "../models/lessonModel";
import { IUser } from "../interfaces/database/IUser";
import UserModel from "../models/userModel";

export class InstructorRepository implements IInstructorRepository{


    async fetchCategories(): Promise<CategoryEntity[]> {
        try {
            return await Category.find()
        } catch (error) {
            console.log("instructor repository error:fetch all categories", error);
            throw new Error(` ${(error as Error).message}`);
        }
    }

    async addCourse(courseData: Partial<ICourse>): Promise<ICourse> {
        try {
            const newCourse = new courseModel(courseData);

            return await newCourse.save()
        } catch (error) {
            console.log("instructor repository error:add course", error);
            throw new Error(` ${(error as Error).message}`);
        }
    }

    async editCourse(courseId: string, updateData: Partial<ICourse>): Promise<ICourse | null> {
        try {
            const course = courseModel.findByIdAndUpdate(courseId, updateData,{new: true})
            if(!course){
                throw new Error('course does not exist')
            }
            return course
        } catch (error) {
            console.log("instructor repository error:edit course", error);
            throw new Error(` ${(error as Error).message}`);
        }
    }


    async getAllCoursesByInstructor(instructorId: mongoose.Types.ObjectId): Promise<ICourse[]> {
        try {
          const courses = await courseModel.aggregate([
            // Match courses by instructor
            { $match: { instructor: instructorId } },
      
            // Lookup category details
            {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category",
              },
            },
            { $unwind: "$category" },
      
            // Lookup lessons
            {
              $lookup: {
                from: "lessons",
                localField: "lessons",
                foreignField: "_id",
                as: "lessons",
              },
            },
      
            // Add lesson count
            {
              $addFields: {
                lessonCount: { $size: "$lessons" },
              },
            },
      
            // Lookup enrollment count
            {
              $lookup: {
                from: "enrollments",
                let: { courseId: "$_id" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$courseId", "$$courseId"] } } },
                  { $count: "studentsCount" },
                ],
                as: "enrollmentData",
              },
            },
      
            // Unwind enrollmentData (preserve courses with no enrollments)
            {
              $unwind: {
                path: "$enrollmentData",
                preserveNullAndEmptyArrays: true,
              },
            },
      
            // First $project: Exclude unwanted fields
            {
              $project: {
                lessons: 0, // Exclude lessons array
              },
            },
      
            // Second $project: Add computed studentsCount
            {
              $project: {
                title: 1, 
                category: 1,
                price: 1,
                thumbnail: 1,
                lessonCount: 1,
                instructor: 1,
                isPublished:1,
                studentsCount: { $ifNull: ["$enrollmentData.studentsCount", 0] }, 
              },
            },
          ]);
      
          console.log("courses with student count", courses);
          return courses as ICourse[];
        } catch (error) {
          console.log("instructor repository error: get all courses", error);
          throw new Error(` ${(error as Error).message}`);
        }
      }


    async getSingleCourse(courseId: string): Promise<ICourse | null> {
        try {
            const course = await courseModel.findById(courseId).populate('instructor', 'userName')
            if (!course) {
                throw new Error('No course found');
            }
            console.log('course instu repo',course)
            return course;
        } catch (error) {
            console.log("instructor repository error:get single course", error);
            throw new Error(` ${(error as Error).message}`);
        }
    }

    async courseLessons(courseId: string): Promise<ILesson[]> {
        
        try {
            return await lessonModel.find({course: courseId}).exec()
          
        } catch (error) {
            console.log("instructor repository error:get all lessons", error);
            throw new Error(` ${(error as Error).message}`);
        }
    }


    async addLesson( lessonData: Partial<ILesson>): Promise<ILesson | null> {
        try {
            const newLesson = new lessonModel(lessonData);
            const savedLesson = await newLesson.save();

             await courseModel.findByIdAndUpdate(
                lessonData.course,
                {$push:{lessons:savedLesson._id}},
                {new: true}
            )
            return savedLesson
        } catch (error) {
            console.log("instructor repository error:add lesson", error);
            throw new Error(` ${(error as Error).message}`);
        }
    }

    async getSingleLesson(lessonId: string): Promise<ILesson | null> {
        try {
            const lesson = await lessonModel.findById(lessonId)
            if (!lesson) {
                throw new Error('No lesson found');
            }
            return lesson;
        } catch (error) {
            console.log("instructor repository error:get single lesson", error);
            throw new Error(` ${(error as Error).message}`);
        }
    }

    async editLesson(lessonId: string, updatedData: Partial<ILesson>): Promise<ILesson | null> {
        try {
            return await lessonModel.findByIdAndUpdate(lessonId, updatedData, {new: true})
        } catch (error) {
            console.log("instructor repository error:edit lesson", error);
            throw new Error(` ${(error as Error).message}`);
        }
    }

    async addAssessment(lessonId: string, assessmentData: Partial<IAssessment>): Promise<ILesson | null> {
        try {
            return await lessonModel.findByIdAndUpdate(
                lessonId,
                {assessment: assessmentData},
                {new: true}
            )
        } catch (error) {
            console.log("instructor repository error:add assessment", error);
            throw new Error(` ${(error as Error).message}`);
        }
    }

    async editAssessment(lessonId: string, updatedData: Partial<IAssessment>): Promise<ILesson | null> {
        try {
            return await lessonModel.findByIdAndUpdate(
                lessonId,
                {$set:{assessment: updatedData}},
                {new: true}
            )
        } catch (error) {
            console.log("instructor repository error:edit assessment", error);
            throw new Error(` ${(error as Error).message}`);
        }
    }

    async publishCourse(courseId: string): Promise<ICourse | null> {
        try {
          const course =await courseModel.findById(courseId)
          if(!course){
            throw new Error('course not found')
          }

          if(course.isPublished){
            throw new Error('course already published')
          }
            return await courseModel.findByIdAndUpdate(courseId,{isPublished:true}, {new: true})
        } catch (error) {
            console.log("instructor repository error:edit lesson", error);
            throw new Error(` ${(error as Error).message}`);
        }
    }

    async getLessonById(lessonId: string): Promise<ILesson | null> {
        try {
          const lesson = await lessonModel.findById(lessonId);
          return lesson;
        } catch (error) {
          console.error("Error in InstructorRepository.getLessonById:", error);
          throw new Error(`Error fetching lesson: ${(error as Error).message}`);
        }
      }

      async updateLessonAssessment(lessonId: string, questions: IAssessment[]): Promise<ILesson> {
        try {
          const lesson = await lessonModel.findByIdAndUpdate(
            lessonId,
            { assessment: questions },
            { new: true, runValidators: true }
          );
          if (!lesson) {
            throw new Error("Lesson not found during update");
          }
          return lesson;
        } catch (error) {
          console.error("Error in InstructorRepository.updateLessonAssessment:", error);
          throw new Error(`Error updating lesson assessment: ${(error as Error).message}`);
        }
      }

    async getInstructorProfile(userId: string): Promise<IUser | null> {
        try {
            return await UserModel.findById(userId);
        } catch (error) {
            console.error("Error fetching instructor profile:", error);
            throw new Error("Failed to fetch instructor profile");
        }
    }

    async updateInstructor(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
        try {
            return UserModel.findOneAndUpdate(
              { _id: new mongoose.Types.ObjectId(userId), role: 'instructor' },
              { $set: updateData },
              { new: true } // Return the updated document
            ).exec();
        } catch (error) {
            console.error("Error updating instructor profile:", error);
            throw new Error("Failed to update instructor profile");
        }
    }

    async findLessonById(lessonId: string):Promise<ILesson| null> {
        try {
          const lesson = await lessonModel.findById(lessonId);
          return lesson;
        } catch (error) {
          console.log('find lesson by id error:',error)
          throw new Error(`Error fetching lesson`);
        }
      }
}

