import Stripe from "stripe";
import { ICourse } from "../../interfaces/courses/ICourse";
import { IEnrollment } from "./IEnrollment";

export interface IUserRepository {
  getAllCourses(): Promise<ICourse[]>;
  getSingleCourse(courseId: string): Promise<ICourse | null>;
  // enrollUserInCourse(userId: string, courseId: string): Promise<void>
  // processPayment(courseId: string, userId: string, paymentInfo: any): Promise<any>;
  enrollUser(userId: string, courseId: string,enrolledAt:Date, completionStatus:string ):Promise<IEnrollment>
}
