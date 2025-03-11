import { CategoryEntity } from "../courses/category";
import { ICourse } from "../courses/ICourse";
import { IEnrollment } from "../database/IEnrollment";

export interface IUserService{
    getAllCourses(): Promise<ICourse[] |null>;
    getSingleCourse(courseId: string): Promise<ICourse | null>;
    getAllCategories():Promise<CategoryEntity[] | null>;
    initiatePayment(userId: string, courseId: string, amount: number, courseName: string, courseThumbnail: string ):Promise<{sessionId: string}>
    courseEnroll (userId: string, courseId: string, completionStatus:string, amount:number, enrolledAt:Date):Promise<IEnrollment>;
    getPaymentStatus(sessionId: string):Promise<any> ;
    getFilteredCourses(
    searchTerm?: string,
    categoryIds?: string[],
    priceMin?: number,
    priceMax?: number,
    sortOrder?: "" | "asc" | "desc",
    page?: number,              
    limit?: number              
    ): Promise<{ courses: ICourse[]; total: number }>;
}