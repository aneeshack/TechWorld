import { IPayment } from "../interfaces/courses/IPayment";
import { IStudentRepository } from "../interfaces/student/IStudentRepository";
import { IUser } from "../interfaces/user/IUser";
import { StudentRepository } from "../repository/studentRepository";

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

      
}