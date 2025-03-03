import { Request, Response } from "express";
import { StudentService } from "../services/studentService";
import { InstructorService } from "../services/instructorService";

export class StudentController{
    constructor(
        private studentService: StudentService,
    ){}

    async getProfile(req: Request, res: Response): Promise<void> {
        try {
          const { userId } = req.params;
          const student = await this.studentService.fetchStudentProfile(userId);
          if (!student) {
            res.status(404).json({ success: false, message: 'Student not found' });
            return;
          }
          res.status(200).json({ success: true, data: student });
        } catch (error) {
          console.error('Error in StudentController.getProfile:', error);
          res.status(500).json({ success: false, message: 'Server error' });
        }
      }
    
      async updateProfile(req: Request, res: Response): Promise<void> {
        try {
          const { userId } = req.params;
          const updateData = req.body;
          const student = await this.studentService.updateStudentProfile(userId,  updateData);
          if (!student) {
            res.status(404).json({ success: false, message: 'Student not found' });
            return;
          }
          res.status(200).json({ success: true, data: student });
        } catch (error) {
          console.error('Error in StudentController.updateProfile:', error);
          res.status(500).json({ success: false, message: 'Server error' });
        }
      }
}