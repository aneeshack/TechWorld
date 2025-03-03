import Stripe from "stripe";
import { ICourse } from "../../interfaces/courses/ICourse";
import { IEnrollment } from "./IEnrollment";

export interface IUserRepository {
  getAllCourses(): Promise<ICourse[]>;
  getSingleCourse(courseId: string): Promise<ICourse | null>;
  
  // enrollUserInCourse(userId: string, courseId: string): Promise<void>
  // processPayment(courseId: string, userId: string, paymentInfo: any): Promise<any>;
  enrollUser(userId: string, courseId: string,enrolledAt:Date, completionStatus:string ):Promise<IEnrollment>
  // findCourses(
  //   page: number,
  //   limit: number, 
  //   searchTerm?: string,              
  //   categoryIds?: string[],           
  //   priceMin?: number,                
  //   priceMax?: number,                
  //   sortOrder?: "" | "asc" | "desc",
  // ): Promise<{ courses: ICourse[]; total: number }>;

  // findCourses(
  //   searchTerm?: string,              
  //   categoryIds?: string[],           
  //   priceMin?: number,                
  //   priceMax?: number,                
  //   sortOrder?: "" | "asc" | "desc",
  // ): Promise<ICourse[]>;

    findCourses(
      searchTerm?: string,
      categoryIds?: string[],
      priceMin?: number,
      priceMax?: number,
      sortOrder?: "" | "asc" | "desc",
      page?: number,              // Add page for pagination
      limit?: number              // Add limit for pagination
    ): Promise<{ courses: ICourse[]; total: number }>; // Update return type

}
