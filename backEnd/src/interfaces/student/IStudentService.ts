import { IPayment } from "../courses/IPayment";
import { IEnrollment } from "../database/IEnrollment";
import { IUser } from "../database/IUser";

export interface IStudentService{
    fetchStudentProfile(userId: string): Promise<IUser | null>;
    updateStudentProfile(userId: string, updateData: Partial<IUser>): Promise<IUser | null>;
    getPaymentsByUserId(userId: string): Promise<IPayment[] | null>;
    getEnrolledCourses(userId: string): Promise<IEnrollment[] |null>
    getEnrollment(userId: string, courseId: string): Promise<IEnrollment |null>;
}