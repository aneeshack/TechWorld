import { IPayment } from "../courses/IPayment";
import { IUser } from "../user/IUser";

export interface IStudentService{
    fetchStudentProfile(userId: string): Promise<IUser | null>;
    updateStudentProfile(userId: string, updateData: Partial<IUser>): Promise<IUser | null>;
    getPaymentsByUserId(userId: string): Promise<IPayment[] | null>
}