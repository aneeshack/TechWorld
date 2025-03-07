import { Request, Response } from "express";
import { StudentService } from "../services/studentService";
import { IStudentService } from "../interfaces/student/IStudentService";
import { IInstructorService } from "../interfaces/user/IInstructorService";
import { InstructorService } from "../services/instructorService";
import { enrollmentModel } from "../models/enrollmentModel";
import { AuthRequest } from "../middlewares/authMiddleware";
import { lessonModel } from "../models/lessonModel";

export class StudentController{
    // constructor(
    //     private studentService: IStudentService,
    //     private instructorService:IInstructorService
    // ){}
    constructor(
      private studentService: StudentService,
      private instructorService:InstructorService
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

    async getStudentPayments(req: Request, res: Response):Promise<void> {
        try {
          const userId = req.params.userId; 
          console.log('student payment',userId)
      
          const payments = await this.studentService.getPaymentsByUserId(userId);
      
          res.status(200).json({
            success: true,
            data: payments, 
            message: "Payments retrieved successfully",
          });
        } catch (error:any) {
          res.status(500).json({
            success: false,
            message: `Error fetching payments: ${error.message}`,
          });
        }
      };

      async fetchSingleCourse(req: Request, res: Response): Promise<void> {
          try {
            console.log("inside fetch student");
      
            const courseId = req.params.courseId;
              console.log('courseid',courseId)
            const course = await this.instructorService.fetchCourse(courseId);
            if (!course) {
              console.log('first')
              res.status(404).json({ success: false, message: "Course not found" });
              return;
            }
            console.log('course',course)
            res
              .status(200)
              .json({ success: true, message: "fetch single course", data: course });
          } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
          }
        }

         async fetchAllLessons(req: Request, res: Response): Promise<void> {
            try {
              console.log("inside fetch all lessons");
        
              const courseId = req.params.courseId;
              if (!courseId) {
                res
                  .status(400)
                  .json({ success: false, message: "invalid credentials" });
                return;
              }
        
              const lessons = await this.instructorService.allLessons(courseId);
              if (!lessons || lessons.length === 0) {
                res.status(404).json({ success: false, message: "No lessons found" });
                return;
              }
              res
                .status(200)
                .json({ success: true, message: "fetch all lessons", data: lessons });
            } catch (error: any) {
              res.status(400).json({ success: false, message: error.message });
            }
          }

          async presSignedUrlForVideo(req: Request, res: Response): Promise<void> {
            try {
              const { lessonId } = req.params;
          
              const presignedUrl = await this.instructorService.getPresignedUrlForVideo(lessonId)
             
              console.log('presinged url',presignedUrl)
              res.json({ presignedUrl });
            } catch (error) {
              console.error("Error in InstructorController :get presigned url for video", error);
              res.status(500).json({ success: false, message: "Server error" });
            }
          }

           async fetchSingleLesson(req: Request, res: Response): Promise<void> {
              try {
                console.log("inside fetch lesson");
                const lessonId = req.params.lessonId;
          
                const lesson = await this.instructorService.fetchLesson(lessonId);
                if (!lesson) {
                  res.status(404).json({ success: false, message: "lesson not found" });
                  return;
                }
                res
                  .status(200)
                  .json({ success: true, message: "fetch single lesson", data: lesson });
              } catch (error: any) {
                res.status(400).json({ success: false, message: error.message });
              }
            }

            async submitAssessment(req: AuthRequest, res: Response):Promise<void> {
              try {
                const { lessonId, score } = req.body;
                const userId = req.user?.id; // Get user ID from authentication middleware
            
                const enrollment = await enrollmentModel.findOne({
                  userId,
                  "progress.completedAssessments": { $ne: lessonId },
                });
            
                if (!enrollment) {
                   res.status(404).json({ message: "Enrollment not found" });
                   return
                }
            
                enrollment.progress.completedAssessments.push(lessonId);
                await enrollment.save();
            
                res.json({ message: "Assessment submitted successfully", score });
              } catch (error) {
                res.status(500).json({ message: "Error submitting assessment", error });
              }
            };

             async updateLessonProgress(req:AuthRequest, res:Response):Promise<void> {
              try {
                const { courseId, lessonId } = req.body;
                const userId = req.user?.id; // Get user ID from authentication middleware
            
                if (!courseId || !lessonId) {
                   res.status(400).json({ message: "Invalid request data." });
                   return
                }
            
                const enrollment = await enrollmentModel.findOne({ userId, courseId });
            
                if (!enrollment) {
                   res.status(404).json({ message: "Enrollment not found." });
                   return
                }
            
                // Add lesson ID to completed lessons if not already there
                if (!enrollment.progress.completedLessons.includes(lessonId)) {
                  enrollment.progress.completedLessons.push(lessonId);
                  
                  // Calculate completion percentage
                  const totalLessons = await lessonModel.countDocuments({ course:courseId });
                  console.log('total lessons',totalLessons)
                  enrollment.progress.overallCompletionPercentage = Math.round(
                    (enrollment.progress.completedLessons.length / totalLessons) * 100
                  );
            
                  // Update completion status
                  if (enrollment.progress.overallCompletionPercentage >= 100) {
                    enrollment.completionStatus = "completed";
                  } else {
                    enrollment.completionStatus = "in-progress";
                  }
            
                  await enrollment.save();
                }
            
                res.status(200).json({ message: "Lesson progress updated successfully." });
              } catch (error) {
                console.error("Error updating progress:", error);
                res.status(500).json({ message: "Internal server error." });
              }
            };
}