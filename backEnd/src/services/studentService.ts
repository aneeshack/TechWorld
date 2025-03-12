import { IPayment } from "../interfaces/courses/IPayment";
import { IStudentRepository } from "../interfaces/student/IStudentRepository";
import { IUser } from "../interfaces/database/IUser";
import { StudentRepository } from "../repository/studentRepository";
import { IEnrollment } from "../interfaces/database/IEnrollment";

export class StudentService{
    constructor(private studentRepository: IStudentRepository){}

     async fetchStudentProfile(userId: string): Promise<IUser | null> {
        try {
          const student = await this.studentRepository.getStudentProfile(userId);
          if (!student) {
              throw new Error("student not found");
          }
          return student;
        } catch (error) {
          console.log("studentService error: student profile", error);
          throw new Error(`${(error as Error).message}`);
        }
    }
    
      async updateStudentProfile(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
        try {
          const student = await this.studentRepository.updateStudent(userId, updateData);
          if (!student) {
            throw new Error('student not found');
          }
          return student;
        } catch (error) {
          console.log("studentService error: student profile updating", error);
          throw new Error(`${(error as Error).message}`);
        }
      }

      async getPaymentsByUserId(userId: string): Promise<IPayment[] | null> {
        try {
          const studentPayment = await this.studentRepository.fetchPayment(userId);
          if (!studentPayment) {
            throw new Error('student Payment history not found');
          }
          return studentPayment;
        } catch (error) {
          console.log("studentService error: student payment updating", error);
          throw new Error(`${(error as Error).message}`);
        }
      }

       async getEnrolledCourses(userId: string): Promise<IEnrollment[] |null> {
          try {
            const enrolledCourses = await this.studentRepository.enrolledCourses(userId)
        
            if (!enrolledCourses) {
              throw new Error("enrolledCourses not found");
            }
        
            return enrolledCourses;
          } catch (error:any) {
            console.log('student service error:enrolled courses ',error)
            throw new Error(`${(error as Error).message}`)
          }
        }

        async getEnrollment(userId: string, courseId: string): Promise<IEnrollment |null> {
          try {
            const enrolledCourses = await this.studentRepository.studentCourseEnrollment(userId, courseId)
        
            if (!enrolledCourses) {
              throw new Error("enrolledCourses not found");
            }
        
            return enrolledCourses;
          } catch (error:any) {
            console.log('student service error:user course enrollment ',error)
            throw new Error(`${(error as Error).message}`)
          }
        }
}