import { PaginationResult } from "../courses/ICourse";
import { IPayment } from "../courses/IPayment";
import { IEnrollment } from "../database/IEnrollment";
import { IReview } from "../database/IReview";
import { IUser } from "../database/IUser";

export interface IStudentRepository {
    getStudentProfile(userId: string): Promise<IUser | null>;
    updateStudent(userId: string, updateData: Partial<IUser>): Promise<IUser | null>;
    fetchPayment(userId: string): Promise<IPayment[] | null>;
    // enrolledCourses(userId: string ):Promise<IEnrollment[] | null>;
    enrolledCourses(userId: string, page: number, limit: number, search: string): Promise<PaginationResult>     
    studentCourseEnrollment(userId: string, courseId: string): Promise<IEnrollment| null>;
    getReview(studentId: string, courseId: string): Promise<IReview| null>;
    createReview(studentId: string, courseId: string, rating: string, reviewText:string): Promise<IReview| null>;
    updateReview(studentId: string, courseId: string, rating: string, reviewText:string): Promise<IReview| null>;
    findByUserAndCourse(userId: string, courseId: string): Promise<IEnrollment | null>
    updateFinalAssessment(
        enrollmentId: string,
        finalAssessment: { completed: boolean; score: number },
        overallCompletionPercentage?: number
      ): Promise<IEnrollment | null>
}