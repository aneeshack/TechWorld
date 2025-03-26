import { ICourse } from "../../interfaces/courses/ICourse";
import { IEnrollment } from "../database/IEnrollment";
import { CategoryEntity } from "../courses/category";

export interface IUserRepository {
  getAllCourses(): Promise<ICourse[]>;
  getSingleCourse(courseId: string): Promise<ICourse | null>;
  enrollUser(userId: string, courseId: string,enrolledAt:Date, completionStatus:string ):Promise<IEnrollment>
  findCourses(
    searchTerm?: string,
    categoryIds?: string[],
    priceMin?: number,
    priceMax?: number,
    sortOrder?: "" | "asc" | "desc",
    page?: number,              
    limit?: number             
  ): Promise<{ courses: ICourse[]; total: number }>; 
  allCategories(): Promise<CategoryEntity[] |null>;
}
