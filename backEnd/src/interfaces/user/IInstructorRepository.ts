import mongoose from "mongoose";
import { CategoryEntity } from "../courses/category";
import { ICourse } from "../courses/ICourse";
import { IAssessment, ILesson } from "../courses/ILesson";

export interface IInstructorRepository {
    fetchCategories(instructorId: mongoose.Types.ObjectId): Promise<CategoryEntity[]>;
    addCourse(courseData: Partial<ICourse>): Promise<ICourse>;
    editCourse(courseId: string, updateData: Partial<ICourse>):Promise<ICourse| null>;
    getAllCoursesByInstructor(instructorId: mongoose.Types.ObjectId): Promise<ICourse[]>;
    getSingleCourse(courseId: string): Promise<ICourse | null>;
    addLesson(courseId: string, lessonData: Partial<ILesson>): Promise<ICourse | null>;
    editLesson(lessonId: string, updatedData: Partial<ILesson>): Promise<ILesson | null>;
    addAssessment(lessonId: string, assessmentData: Partial<IAssessment>): Promise<ILesson | null>;
    editAssessment(lessonId: string, updatedData: Partial<IAssessment>): Promise<ILesson | null>; 
}