import { IPayment } from "../interfaces/courses/IPayment";
import { IStudentRepository } from "../interfaces/student/IStudentRepository";
import { IUser } from "../interfaces/database/IUser";
import { IEnrollment } from "../interfaces/database/IEnrollment";
import { IReview } from "../interfaces/database/IReview";
import { PaginationResult } from "../interfaces/courses/ICourse";
import { courseModel } from "../models/courseModel";

export class StudentService{
    constructor(private _studentRepository: IStudentRepository){}

     async fetchStudentProfile(userId: string): Promise<IUser | null> {
        try {
          const student = await this._studentRepository.getStudentProfile(userId);
          if (!student) {
              throw new Error("student not found");
          }
          return student;
        } catch (error) {
          console.error("studentService error: student profile", error);
          throw new Error(`${(error as Error).message}`);
        }
    }
    
      async updateStudentProfile(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
        try {
          const student = await this._studentRepository.updateStudent(userId, updateData);
          if (!student) {
            throw new Error('student not found');
          }
          return student;
        } catch (error) {
          console.error("studentService error: student profile updating", error);
          throw new Error(`${(error as Error).message}`);
        }
      }

      async getPaymentsByUserId(userId: string): Promise<IPayment[] | null> {
        try {
          const studentPayment = await this._studentRepository.fetchPayment(userId);
          if (!studentPayment) {
            throw new Error('student Payment history not found');
          }
          return studentPayment;
        } catch (error) {
          console.error("studentService error: student payment updating", error);
          throw new Error(`${(error as Error).message}`);
        }
      }


      async getEnrolledCourses(userId: string, page: number, limit: number, search: string): Promise<PaginationResult> {
        try {
          const result = await this._studentRepository.enrolledCourses(userId, page, limit, search);
          console.log('serahc result',result)
          if (!result || !result.courses) {
            throw new Error("No enrolled courses found");
          }
    
          return result;
        } catch (error: unknown) {
          console.error("Student service error: enrolled courses", error);
          throw new Error(`${(error as Error).message}`);
        }
      }
        async getEnrollment(userId: string, courseId: string): Promise<IEnrollment |null> {
          try {
            const enrolledCourses = await this._studentRepository.studentCourseEnrollment(userId, courseId)
        
            if (!enrolledCourses) {
              throw new Error("enrolledCourses not found");
            }
        
            return enrolledCourses;
          } catch (error:unknown) {
            console.error('student service error:user course enrollment ',error)
            throw new Error(`${(error as Error).message}`)
          }
        }

        async addReview(studentId: string, courseId: string, rating: string, reviewText:string): Promise<IReview |null> {
          try {
            const existingReview = await this._studentRepository.getReview(studentId, courseId);

            if (existingReview) {
              // Update existing review
              return await this._studentRepository.updateReview(
                studentId,
                courseId,
                rating,
                reviewText
              );
            } else {
              // Create new review
              return await this._studentRepository.createReview(
                studentId,
                courseId,
                rating,
                reviewText
              );
            }
          } catch (error:unknown) {
            console.error('student service error:user course rating ',error)
            throw new Error(`${(error as Error).message}`)
          }
        }

        async submitFinalExam(
          userId: string,
          courseId: string,
          score: number
        ): Promise<IEnrollment> {
          // Find the enrollment
          const enrollment = await this._studentRepository.findByUserAndCourse(userId, courseId);
          if (!enrollment) {
            throw new Error("Enrollment not found");
          }
      
          // Calculate overallCompletionPercentage
          // const totalLessons = await this.getTotalLessons(courseId);
          // const completedLessons = enrollment.progress.completedLessons.length;
          // const lessonCompletionPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 50 : 0; // 50% weight for lessons
          // const examPercentage = (score / 100) * 50; // 50% weight for exam (score is already a percentage)
          // const overallCompletionPercentage = Math.min(100, lessonCompletionPercentage + examPercentage);
      
          // Update final assessment and completion percentage
          const updatedEnrollment = await this._studentRepository.updateFinalAssessment(
            enrollment._id.toString(),
            {
              completed: true, // Mark as completed since the exam is submitted
              score, // Store percentage score
            },
            // overallCompletionPercentage
          );
      
          if (!updatedEnrollment) {
            throw new Error("Failed to update enrollment");
          }
      
          return updatedEnrollment;
        }
      
       async getTotalLessons(courseId: string): Promise<number> {
          const course = await courseModel.findById(courseId).exec();
          return course?.lessons?.length || 0; // Assuming course has a lessons array
        }
      
}