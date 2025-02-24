import { IUserRepository } from "../interfaces/user/IUserRepository";
import { courseModel } from "../models/courseModel";
import { ICourse } from "../interfaces/courses/ICourse";
import UserModel from "../models/userModel";

export class UserRepository implements IUserRepository {
  
  async getAllCourses(): Promise<ICourse[]> {
    try {

      const courses = await courseModel.find({ isPublished: true })
        .populate("category", "categoryName")
        .populate('instructor', 'userName')
        .exec();
        console.log('courses',courses)
        return courses
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async getSingleCourse(courseId: string): Promise<ICourse | null> {
    try {
      // Fetch a single published course along with its category details.
      const course =  await courseModel.findOne({ _id: courseId, isPublished: true })
        .populate("category", "categoryName")
        .populate("instructor", "userName")
        .populate({
          path:'lessons',
          select: 'lessonNumber title thumbnail video ',
          options: {sort: {lessonNumber:1}}
        })
        .exec();

        console.log('course details',course)
        return course
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async enrollUserInCourse(userId: string, courseId: string): Promise<void> {
    await UserModel.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { enrolledCourses: courseId } }
    );
  }

  // async createPaymentIntent(amount: number, currency: string): Promise<any> {
  //   try {
  //     // Integrate with your payment gateway here.
  //     // For now, we simulate a successful payment and enrollment.
  //     return {
  //       courseId,
  //       userId,
  //       status: "Payment Successful",
  //       transactionId: "TXN123456789",
  //     };
  //   } catch (error) {
  //     throw new Error((error as Error).message);
  //   }
  // }

}
