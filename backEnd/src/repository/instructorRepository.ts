import mongoose from "mongoose";
import { CategoryEntity } from "../interfaces/courses/category";
import { ICourse } from "../interfaces/courses/ICourse";
import { IAssessment, ILesson } from "../interfaces/courses/ILesson";
import { IInstructorRepository } from "../interfaces/user/IInstructorRepository";
import { Category } from "../models/categoryModel";
import { courseModel } from "../models/courseModel";
import { lessonModel } from "../models/lessonModel";

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
            return courseModel.find({instructor: instructorId})
                .populate('category','categoryName')
                .exec()
        } catch (error) {
            console.log("instructor repository error:get all course", error);
            throw new Error(` ${(error as Error).message}`);
        }
    }

    async getSingleCourse(courseId: string): Promise<ICourse | null> {
        try {
            const course = await courseModel.findById(courseId)
            if (!course) {
                throw new Error('No course found');
            }
            return course;
        } catch (error) {
            console.log("instructor repository error:get single course", error);
            throw new Error(` ${(error as Error).message}`);
        }
    }

    async addLesson(courseId: string, lessonData: Partial<ILesson>): Promise<ICourse | null> {
        try {
            const newLesson = new lessonModel(lessonData);
            const savedLesson = await newLesson.save();

            return await courseModel.findByIdAndUpdate(
                courseId,
                {$push:{lessons:savedLesson._id}},
                {new: true}
            )
        } catch (error) {
            console.log("instructor repository error:add lesson", error);
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
}