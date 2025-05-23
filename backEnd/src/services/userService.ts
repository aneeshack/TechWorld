import { IUserRepository } from "../interfaces/user/IUserRepository";
import { ICourse } from "../interfaces/courses/ICourse";
import { PaymentRepository } from "../repository/paymentRepository";
import { IEnrollment } from "../interfaces/database/IEnrollment";
import { CategoryEntity } from "../interfaces/courses/category";
import Stripe from "stripe";
import { inject, injectable } from "inversify";
import { USER_TYPES } from "../interfaces/types";



export interface payment{
  userId:string, 
  courseId :string,
  status:'completed',
  amount :number
}

@injectable()
export class UserService {
  constructor(
   @inject(USER_TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(USER_TYPES.PaymentRepository)private _paymentRepo: PaymentRepository = new PaymentRepository(),
  ) {}
  
  async getFilteredCourses(
    searchTerm: string,
    categoryIds: string[],
    priceMin?: number,
    priceMax?: number,
    sortOrder: "" | "asc" | "desc" | undefined = "",
    page: number = 1,
    limit: number = 10
  ): Promise<{ courses: ICourse[]; total: number }> {
    return this._userRepository.findCourses(searchTerm, categoryIds, priceMin, priceMax, sortOrder, page, limit);
  }

  async getAllCourses(): Promise<ICourse[] | null> {
    try {
      const courses = await this._userRepository.getAllCourses();
      if(!courses){
        throw new Error('No courses found')
      }
      return courses
    } catch (error) {
      console.error('user service error:get sigle course',error)
      throw new Error(`${(error as Error).message}`)
    }
  }

  async getSingleCourse(courseId: string): Promise<ICourse | null> {
    try {
      return await this._userRepository.getSingleCourse(courseId);
    } catch (error) {
      console.error('user service error:get sigle course',error)
      throw new Error(`${(error as Error).message}`)
    }
  }

  
  async getAllCategories():Promise<CategoryEntity[] | null>{
      try {
          const categories = await this._userRepository.allCategories();
          if(!categories){
              throw new Error('No categories found')
          }
          return categories
      } catch (error) {
          console.error('userService error:get all categories',error)
          throw new Error(`${(error as Error).message}`)
      }
  }

  async initiatePayment(
    userId: string,
    courseId: string,
    amount: number,
    courseName: string,
    courseThumbnail: string
  ):Promise<{sessionId: string}> {
    try {
      const session = await this._paymentRepo.createCheckoutSession(
        userId,
        courseId,
        amount,
        courseName,
        courseThumbnail
      );
      console.log('sessionid',session.id)
      return { sessionId: session.id };
    } catch (error) {
      console.error('user service error:create payment ',error)
      throw new Error(`${(error as Error).message}`)
    }
  }

  async getPaymentStatus(sessionId: string): Promise<Stripe.Checkout.Session> {
    return await this._paymentRepo.getSession(sessionId);
  }

  async courseEnroll (userId: string, courseId: string, completionStatus:string, amount:number, enrolledAt:Date):Promise<IEnrollment>{
    try {
      const paymentData: payment ={
        userId, 
        courseId,
        status:'completed',
        amount
      }
      const payment = await this._paymentRepo.paymentCompletion(paymentData)
      if (!payment) {
        throw new Error("Payment processing failed.");
      }

      const enrollment = await this._userRepository.enrollUser(userId,courseId, enrolledAt,completionStatus)
      if (!enrollment) {
      throw new Error("Enrollment failed.");
    }
    return enrollment; 
    } catch (error) {
      console.error('user service error:enroll course ',error)
      throw new Error(`${(error as Error).message}`)
    }
  }


}
