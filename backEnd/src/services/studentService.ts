import { IUser } from "../interfaces/user/IUser";
import { StudentRepository } from "../repository/studentRepository";

export class StudentService{
    constructor(private studentRepository: StudentRepository){}

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
}