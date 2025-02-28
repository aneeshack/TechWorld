import { IUserRepository } from "../interfaces/user/IUserRepository";
import { UserRepository } from "../repository/userRepository";
import { ICourse } from "../interfaces/courses/ICourse";
import { PaymentRepository } from "../repository/paymentRepository";
import { IEnrollment } from "../interfaces/user/IEnrollment";
import { CategoryEntity } from "../interfaces/courses/category";

export class UserService {
  // constructor(private userRepository: IUserRepository){}
  constructor(
    private userRepository: UserRepository,
    private paymentRepo: PaymentRepository = new PaymentRepository(),
  ) {}

  async getAllCourses(): Promise<ICourse[]> {
    try {
      return await this.userRepository.getAllCourses();
    } catch (error) {
      console.log('user service error:get all courses',error)
      throw new Error(`${(error as Error).message}`)
    }
  }

  async getSingleCourse(courseId: string): Promise<ICourse | null> {
    try {
      return await this.userRepository.getSingleCourse(courseId);
    } catch (error) {
      console.log('user service error:get sigle course',error)
      throw new Error(`${(error as Error).message}`)
    }
  }
  
  async getAllCategories():Promise<CategoryEntity[]>{
      try {
          const categories = await this.userRepository.allCategories();
          if(!categories){
              throw new Error('No categories found')
          }
          return categories
      } catch (error) {
          console.log('userService error:get all categories',error)
          throw new Error(`${(error as Error).message}`)
      }
  }

  async initiatePayment(
    userId: string,
    courseId: string,
    amount: number,
    courseName: string,
    courseThumbnail: string
  ) {
    console.log('initite payment')
    const session = await this.paymentRepo.createCheckoutSession(
      userId,
      courseId,
      amount,
      courseName,
      courseThumbnail
    );
    console.log('sessionid',session.id)
    return { sessionId: session.id };
  }

  async getPaymentStatus(sessionId: string) {
    return await this.paymentRepo.getSession(sessionId);
  }

  // async processPayment(paymentData: {
  //   courseId: string;
  //   userId: string;
  //   amount: number;
  //   courseName: string;
  //   courseThumbnail: string;
  // }): Promise<any> {
  //   try {
  //     const session = await this.userRepository.createPaymentSession(paymentData);
  //     return session;
  //   } catch (error) {
  //     console.log('user service error:process payment ',error)
  //     throw new Error(`${(error as Error).message}`)
  //   }
  // }


  async courseEnroll (userId: string, courseId: string, completionStatus:string, amount:number, enrolledAt:Date):Promise<IEnrollment>{
    try {
      const paymentData ={
        userId, 
        courseId,
        status:'completed',
        amount
      }
      const payment = await this.paymentRepo.paymentCompletion(paymentData)
      if (!payment) {
        throw new Error("Payment processing failed.");
      }

      const enrollment = await this.userRepository.enrollUser(userId,courseId, enrolledAt,completionStatus)
      if (!enrollment) {
      throw new Error("Enrollment failed.");
    }
    return enrollment; 
    } catch (error) {
      console.log('user service error:enroll course ',error)
      throw new Error(`${(error as Error).message}`)
    }
  }

  async getEnrolledCourses(userId: string): Promise<IEnrollment[]> {
    try {
      const enrolledCourses = await this.userRepository.enrolledCourses(userId)
  
      if (!enrolledCourses) {
        throw new Error("enrolledCourses not found");
      }
  
      return enrolledCourses;
    } catch (error:any) {
      console.log('user service error:enrolled courses ',error)
      throw new Error(`${(error as Error).message}`)
    }
  }
  
}
