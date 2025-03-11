import { IPayment } from "../courses/IPayment";
import { IEnrollment } from "../database/IEnrollment";
import { IUser } from "../database/IUser";

export interface IStudentRepository {
    getStudentProfile(userId: string): Promise<IUser | null>;
    updateStudent(userId: string, updateData: Partial<IUser>): Promise<IUser | null>;
    fetchPayment(userId: string): Promise<IPayment[] | null>;
    enrolledCourses(userId: string ):Promise<IEnrollment[] | null>
}