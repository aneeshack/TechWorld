import mongoose from "mongoose";
import { CategoryEntity } from "../courses/category";
import { ICourse } from "../courses/ICourse";
import { ILesson } from "../courses/ILesson";
import { IUser } from "../database/IUser";

export interface IInstructorService{
    getCategories(): Promise<CategoryEntity[]>;
    createCourse(courseData: Partial<ICourse>): Promise<ICourse | null>;
    updateCourse(courseId: string,courseData: Partial<ICourse>): Promise<ICourse | null>;
fetchAllCourses(
    instructorId: mongoose.Types.ObjectId,
    page: number,
    limit: number,
    search: string
  ): Promise<{ courses: ICourse[]; totalPages: number; totalCourses: number } | null>    
   fetchCourse(courseId: string): Promise<ICourse | null>;
    getPresignedUrl(fileName: string,fileType: string): Promise<{ presignedUrl: string; videoUrl: string }>;
    addLesson(lessonData: Partial<ILesson>): Promise<ILesson | null>;
    allLessons(courseId: string): Promise<ILesson[] | null>;
    fetchLesson(lessonId: string): Promise<ILesson | null>;
    updateLesson(lessonId: string,updateData: Partial<ILesson>): Promise<ILesson | null>;
    publishCourse(courseId: string): Promise<ICourse | null>;
    fetchInstructorProfile(userId: string): Promise<IUser | null>;
    updateInstructorProfile(userId: string, updateData: Partial<IUser>): Promise<IUser | null>;
    addAssessment(lessonId: string, questions: any): Promise<ILesson>;
}