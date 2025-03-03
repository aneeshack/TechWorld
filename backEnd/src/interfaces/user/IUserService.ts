import { CategoryEntity } from "../courses/category";
import { ICourse } from "../courses/ICourse";
import { IEnrollment } from "./IEnrollment";

export interface IUserService{
    getAllCourses(): Promise<ICourse[]>;
    getSingleCourse(courseId: string): Promise<ICourse | null>;
    getAllCategories():Promise<CategoryEntity[]>;
    initiatePayment(userId: string, courseId: string, amount: number, courseName: string, courseThumbnail: string ):Promise<{sessionId: string}>
    courseEnroll (userId: string, courseId: string, completionStatus:string, amount:number, enrolledAt:Date):Promise<IEnrollment>;
    getEnrolledCourses(userId: string): Promise<IEnrollment[]>;
    getPaymentStatus(sessionId: string):Promise<any> ;
}