import { IUserRepository } from "../interfaces/user/IUserRepository";
import { UserRepository } from "../repository/userRepository";
import { ICourse } from "../interfaces/courses/ICourse";
import { PaymentRepository } from "../repository/paymentRepository";

export class UserService {
  // constructor(private userRepository: IUserRepository){}
  constructor(
    private userRepository: UserRepository,
    private paymentRepo: PaymentRepository = new PaymentRepository(),
  ) {}

  async getAllCourses(): Promise<ICourse[]> {
    try {
      // Fetch only published courses (public view)
      return await this.userRepository.getAllCourses();
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async getSingleCourse(courseId: string): Promise<ICourse | null> {
    try {
      return await this.userRepository.getSingleCourse(courseId);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
  async processPayment(courseId: string, userId: string, amount: number, currency: string) {
    return await this.paymentRepo.createPaymentIntent(amount, currency);
  }

  async confirmPayment(paymentIntentId: string, userId: string, courseId: string): Promise<void> {
    const paymentStatus = await this.paymentRepo.getPaymentStatus(paymentIntentId);

    if (paymentStatus === "succeeded") {
      await this.userRepository.enrollUserInCourse(userId, courseId);
    } else {
      throw new Error("Payment not successful.");
    }
  }

  // async processPayment(
  //   courseId: string,
  //   userId: string,
  //   amount: number,
  //   currency: string
  // ): Promise<any> {
  //   try {
  //     // Process the payment and handle course enrollment/purchase logic.
  //     // Here, we simulate a successful payment process.
  //     return await this.userRepository.createPaymentIntent(amount, currency);
  //   } catch (error) {
  //     throw new Error((error as Error).message);
  //   }
  // }
}
