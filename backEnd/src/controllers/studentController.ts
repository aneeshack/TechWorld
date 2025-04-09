import { Request, Response } from "express";
import { IStudentService } from "../interfaces/student/IStudentService";
import { IInstructorService } from "../interfaces/instructor/IInstructorService";
import { enrollmentModel } from "../models/enrollmentModel";
import { AuthRequest } from "../middlewares/authMiddleware";
import { lessonModel } from "../models/lessonModel";
import { reviewModel } from "../models/reviewModel";
import S3Service from "../services/s3Service";
import s3Service from "../services/s3ServiceInstance";
import { throwError } from "../middlewares/errorMiddleware";
import { HTTP_STATUS } from "../constants/httpStatus";

export class StudentController{
    constructor(
        private _studentService: IStudentService,
        private _instructorService:IInstructorService,
        private _s3Service: S3Service = s3Service
    ){}


    async getProfile(req: Request, res: Response): Promise<void> {
        try {
          const { userId } = req.params;
          if(!userId){
            throwError(HTTP_STATUS.BAD_REQUEST, 'Student id is required')
          }
          const student = await this._studentService.fetchStudentProfile(userId);
          if (!student) {
            res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Student not found' });
            return;
          }
          res.status(HTTP_STATUS.OK).json({ success: true, data: student });
        } catch (error) {
          console.error('Error in StudentController.getProfile:', error);
          res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Server error' });
        }
      }
    
    async updateProfile(req: Request, res: Response): Promise<void> {
      try {
        const { userId } = req.params;
        const updateData = req.body;
        const student = await this._studentService.updateStudentProfile(userId,  updateData);
        if (!student) {
          res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Student not found' });
          return;
        }
        res.status(HTTP_STATUS.OK).json({ success: true, data: student });
      } catch (error) {
        console.error('Error in StudentController.updateProfile:', error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Server error' });
      }
    }

    async getStudentPayments(req: Request, res: Response):Promise<void> {
        try {
          const userId = req.params.userId; 
      
          const payments = await this._studentService.getPaymentsByUserId(userId);
      
          res.status(HTTP_STATUS.OK).json({
            success: true,
            data: payments, 
            message: "Payments retrieved successfully",
          });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "An unexpected error occurred";
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
        }
      };

      async fetchSingleCourse(req: Request, res: Response): Promise<void> {
          try {
      
            const courseId = req.params.courseId;
            const course = await this._instructorService.fetchCourse(courseId);
            if (!course) {
              res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: "Course not found" });
              return;
            }
            res
              .status(HTTP_STATUS.OK)
              .json({ success: true, message: "fetch single course", data: course });
          }catch (error: unknown) {
            const message = error instanceof Error ? error.message : "An unexpected error occurred";
              res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
          }
        }

  async fetchAllLessons(req: Request, res: Response): Promise<void> {
    try {
      const courseId = req.params.courseId;
      if (!courseId) {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ success: false, message: "invalid credentials" });
        return;
      }

      const lessons = await this._instructorService.allLessons(courseId);
      if (!lessons || lessons.length === 0) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: "No lessons found" });
        return;
      }
      res
        .status(HTTP_STATUS.OK)
        .json({ success: true, message: "fetch all lessons", data: lessons });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
    }
  }


  async presSignedUrlForVideo(req: Request, res: Response): Promise<void> {
    try {
      const { lessonId } = req.params;

      const lesson = await this._instructorService.fetchLesson(lessonId); 
      if (!lesson || !lesson.video) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: "Lesson or video not found" });
        return;
      }

      const videoKey = lesson.video.split(".amazonaws.com/")[1]; // Extract S3 key from URL
      const presignedUrl = await this._s3Service.generatePresignedUrl(videoKey, 300); 
      console.log('presigned url',presignedUrl)
      
      res.status(HTTP_STATUS.OK).json({ success: true, presignedUrl });
    }catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      console.error("Error in StudentController: get presigned URL for video", error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
    } 
  }

    async fetchSingleLesson(req: Request, res: Response): Promise<void> {
      try {
        const lessonId = req.params.lessonId;
  
        const lesson = await this._instructorService.fetchLesson(lessonId);
        if (!lesson) {
          res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: "lesson not found" });
          return;
        }
        res
          .status(HTTP_STATUS.OK)
          .json({ success: true, message: "fetch single lesson", data: lesson });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "An unexpected error occurred";
          res.status(400).json({ success:false, message: message })
      }
    }

      async updateLessonProgress(req:AuthRequest, res:Response):Promise<void> {
      try {
        const { courseId, lessonId } = req.body;
        const userId = req.user?.id; 
    
        if (!courseId || !lessonId) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Invalid request data." });
            return
        }
    
        const enrollment = await enrollmentModel.findOne({ userId, courseId });
    
        if (!enrollment) {
            res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Enrollment not found." });
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
    
        res.status(HTTP_STATUS.OK).json({ message: "Lesson progress updated successfully." });
      } catch (error) {
        console.error("Error updating progress:", error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Internal server error." });
      }
    };

    async fetchEnrolledCourses(req: Request, res: Response): Promise<void> {
      try {
        const { userId } = req.params; 
    
        if (!userId) {
          res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: "User ID is required" });
          return;
        }
    
        const enrolledCourses = await this._studentService.getEnrolledCourses(userId);
    
        res.status(HTTP_STATUS.OK).json({ success: true, message: "Fetched enrolled courses", data: enrolledCourses });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "An unexpected error occurred";
          res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
      }
    }

    async getEnrollment(req: AuthRequest, res: Response): Promise<void> {
      try {
        const { courseId } = req.params; 
        const userId = req.user?.id
    
        if (!userId) {
          res.status(HTTP_STATUS.FORBIDDEN).json({ success: false, message: "User ID is required" });
          return;
        }
    
        
        if (!courseId) {
          res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: "course ID is required" });
          return;
        }
    
        const enrollment = await this._studentService.getEnrollment(userId.toString(),courseId);
    
        res.status(HTTP_STATUS.OK).json({ success: true, message: "Fetched enrollment of courses", data: enrollment });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "An unexpected error occurred";
          res.status(400).json({ success:false, message: message })
      }
    }

    async updateReview(req: AuthRequest, res: Response): Promise<void> {
      try {
        const { courseId } = req.params; 
        const userId = req.user?.id
        const {rating, review } = req.body
    
        if (!userId) {
          res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: "User ID is required" });
          return;
        }
          
        if (!courseId) {
          res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: "course ID is required" });
          return;
        }
    
        const courseReview = await this._studentService.addReview(userId.toString(),courseId, rating, review);
    
        res.status(HTTP_STATUS.OK).json({ success: true, message: "add review to a courses", data: courseReview });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "An unexpected error occurred";
          res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
      }
    }

    async getStudentReview (req: AuthRequest, res: Response):Promise<void> {
      try {
          const { courseId } = req.params;
          const studentId = req.user?.id; 
  
          if (!studentId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: "Unauthorized" });
                return
          }
  
          const review = await reviewModel.findOne({ studentId, courseId });
  
          if (!review) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: "No review found" });
                return
          }
  
          res.status(HTTP_STATUS.OK).json({ success: true, data: review });
      } catch (error) {
          console.error("Error fetching review:", error);
          res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal server error" });
      }
    }
}