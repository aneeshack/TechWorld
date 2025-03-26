import { Request, Response } from "express";
import { IStudentService } from "../interfaces/student/IStudentService";
import { IInstructorService } from "../interfaces/instructor/IInstructorService";
import { enrollmentModel } from "../models/enrollmentModel";
import { AuthRequest } from "../middlewares/authMiddleware";
import { lessonModel } from "../models/lessonModel";
import { reviewModel } from "../models/reviewModel";

export class StudentController{
    constructor(
        private _studentService: IStudentService,
        private _instructorService:IInstructorService
    ){}


    async getProfile(req: Request, res: Response): Promise<void> {
        try {
          const { userId } = req.params;
          const student = await this._studentService.fetchStudentProfile(userId);
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
        const student = await this._studentService.updateStudentProfile(userId,  updateData);
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
      
          const payments = await this._studentService.getPaymentsByUserId(userId);
      
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
      
            const courseId = req.params.courseId;
            const course = await this._instructorService.fetchCourse(courseId);
            if (!course) {
              res.status(404).json({ success: false, message: "Course not found" });
              return;
            }
            res
              .status(200)
              .json({ success: true, message: "fetch single course", data: course });
          } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
          }
        }

  async fetchAllLessons(req: Request, res: Response): Promise<void> {
    try {
      const courseId = req.params.courseId;
      if (!courseId) {
        res
          .status(400)
          .json({ success: false, message: "invalid credentials" });
        return;
      }

      const lessons = await this._instructorService.allLessons(courseId);
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
  
      const presignedUrl = await this._instructorService.getPresignedUrlForVideo(lessonId)
            res.json({ presignedUrl });
    } catch (error) {
      console.error("Error in InstructorController :get presigned url for video", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

    async fetchSingleLesson(req: Request, res: Response): Promise<void> {
      try {
        const lessonId = req.params.lessonId;
  
        const lesson = await this._instructorService.fetchLesson(lessonId);
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
        const userId = req.user?.id; 
        
        res.status(200).json({ message: "Assessment submitted successfully", score });
      } catch (error) {
        res.status(500).json({ message: "Error submitting assessment", error });
      }
    };

      async updateLessonProgress(req:AuthRequest, res:Response):Promise<void> {
      try {
        const { courseId, lessonId } = req.body;
        const userId = req.user?.id; 
    
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

    async fetchEnrolledCourses(req: Request, res: Response): Promise<void> {
      try {
        const { userId } = req.params; 
    
        if (!userId) {
          res.status(400).json({ success: false, message: "User ID is required" });
          return;
        }
    
        const enrolledCourses = await this._studentService.getEnrolledCourses(userId);
    
        res.status(200).json({ success: true, message: "Fetched enrolled courses", data: enrolledCourses });
      } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
      }
    }

    async getEnrollment(req: AuthRequest, res: Response): Promise<void> {
      try {
        const { courseId } = req.params; 
        const userId = req.user?.id
    
        if (!userId) {
          res.status(400).json({ success: false, message: "User ID is required" });
          return;
        }
    
        
        if (!courseId) {
          res.status(400).json({ success: false, message: "course ID is required" });
          return;
        }
    
        const enrollment = await this._studentService.getEnrollment(userId.toString(),courseId);
    
        res.status(200).json({ success: true, message: "Fetched enrollment of courses", data: enrollment });
      } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
      }
    }

    async updateReview(req: AuthRequest, res: Response): Promise<void> {
      try {
        const { courseId } = req.params; 
        const userId = req.user?.id
        const {rating, review } = req.body
    
        if (!userId) {
          res.status(400).json({ success: false, message: "User ID is required" });
          return;
        }
          
        if (!courseId) {
          res.status(400).json({ success: false, message: "course ID is required" });
          return;
        }
    
        const courseReview = await this._studentService.addReview(userId.toString(),courseId, rating, review);
    
        res.status(200).json({ success: true, message: "add review to a courses", data: courseReview });
      } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
      }
    }

    async getStudentReview (req: AuthRequest, res: Response):Promise<void> {
      try {
          const { courseId } = req.params;
          const studentId = req.user?.id; 
  
          if (!studentId) {
                res.status(401).json({ success: false, message: "Unauthorized" });
                return
          }
  
          const review = await reviewModel.findOne({ studentId, courseId });
  
          if (!review) {
                res.status(404).json({ success: false, message: "No review found" });
                return
          }
  
          res.status(200).json({ success: true, data: review });
      } catch (error) {
          console.error("Error fetching review:", error);
          res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
}