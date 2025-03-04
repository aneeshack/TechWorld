import { IPayment } from "../courses/IPayment";
import { IUser } from "../user/IUser";

export interface IStudentRepository {
    getStudentProfile(userId: string): Promise<IUser | null>;
    updateStudent(userId: string, updateData: Partial<IUser>): Promise<IUser | null>;
    fetchPayment(userId: string): Promise<IPayment[] | null>
}