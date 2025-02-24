import Stripe from "stripe";
import { ICourse } from "../../interfaces/courses/ICourse";

export interface IUserRepository {
  getAllCourses(): Promise<ICourse[]>;
  getSingleCourse(courseId: string): Promise<ICourse | null>;
  enrollUserInCourse(userId: string, courseId: string): Promise<void>
  // createPaymentIntent(amount: number, currency: string): Promise<Stripe.PaymentIntent>;
  // processPayment(courseId: string, userId: string, paymentInfo: any): Promise<any>;
}
