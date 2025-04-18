import { PaginationResult } from "../courses/ICourse";
import { IPayment } from "../courses/IPayment";
import { IEnrollment } from "../database/IEnrollment";
import { IReview } from "../database/IReview";
import { IUser } from "../database/IUser";

export interface IStudentService{
    fetchStudentProfile(userId: string): Promise<IUser | null>;
    updateStudentProfile(userId: string, updateData: Partial<IUser>): Promise<IUser | null>;
    getPaymentsByUserId(userId: string): Promise<IPayment[] | null>;
    // getEnrolledCourses(userId: string): Promise<IEnrollment[] |null>
    getEnrolledCourses(userId: string, page: number, limit: number, search: string): Promise<PaginationResult>    
    getEnrollment(userId: string, courseId: string): Promise<IEnrollment |null>;
    addReview(userId: string, courseId: string,rating: string, reviewText:string): Promise<IReview |null>
}