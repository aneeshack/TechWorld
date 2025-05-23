import mongoose from "mongoose";
import { CategoryEntity } from "../courses/category";
import { ICourse } from "../courses/ICourse";
import { IAssessment, ILesson } from "../courses/ILesson";
import { IUser } from "../database/IUser";


export interface IInstructorRepository {
    fetchCategories(): Promise<CategoryEntity[]>;
    addCourse(courseData: Partial<ICourse>): Promise<ICourse>;
    editCourse(courseId: string, updateData: Partial<ICourse>):Promise<ICourse| null>;
    getAllCoursesByInstructor(
      instructorId: mongoose.Types.ObjectId,
      page: number,
      limit: number,
      search: string
    ): Promise<{ courses: ICourse[]; totalPages: number; totalCourses: number }>
    getSingleCourse(courseId: string): Promise<ICourse | null>;
    getSingleLesson(lessonId: string): Promise<ILesson | null>;
    addLesson( lessonData: Partial<ILesson>): Promise<ILesson | null>;
    courseLessons(courseId: string): Promise<ILesson[]>;
    editLesson(lessonId: string, updatedData: Partial<ILesson>): Promise<ILesson | null>;
    publishCourse(courseId: string): Promise<ICourse| null>;
    addAssessment(lessonId: string, assessmentData: Partial<IAssessment>): Promise<ILesson | null>;
    editAssessment(lessonId: string, updatedData: Partial<IAssessment>): Promise<ILesson | null>; 
    getInstructorProfile(userId: string): Promise<IUser | null>;
    updateInstructor(userId: string, updateData: Partial<IUser>): Promise<IUser | null>;
    getLessonById(lessonId: string): Promise<ILesson | null>;
    updateLessonAssessment(lessonId: string, questions: any): Promise<ILesson>;
    findLessonById(lessonId: string):Promise<ILesson| null>;
     getCourseById(courseId: string): Promise<ICourse | null>;
     updateCourseAssessment(courseId: string, questions: IAssessment[]): Promise<ICourse>
}