import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { Role } from "../interfaces/database/IUser";
import { IInstructorService } from "../interfaces/instructor/IInstructorService";
import S3Service from "../services/s3Service";
import { throwError } from "../middlewares/errorMiddleware";
import { HTTP_STATUS } from "../constants/httpStatus";
import { QueryParams } from "../interfaces/courses/ICourse";


export class InstructorController {
  constructor(
    private _instructorService: IInstructorService,
     private _s3Service: S3Service = new S3Service()
  ) {}

  async fetchCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this._instructorService.getCategories();
      res
        .status(HTTP_STATUS.OK)
        .json({
          success: true,
          message: "fetch all categories",
          data: categories,
        });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
    }
  }

  async createCourse(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || req.user.role !== Role.Instructor || !req.user.id) {
       return throwError(HTTP_STATUS.FORBIDDEN, "Forbidden: Only instructors can create courses");
      }

      const { title, description, thumbnail, category, price } = req.body;

      const instructorId = req.user.id;
      if (!title || !description || !thumbnail || !category || !price) {
        throwError(HTTP_STATUS.BAD_REQUEST, "Invalid credentials: All fields are required");
      }

      const courseData = {
        title,
        description,
        thumbnail,
        instructor: instructorId,
        category,
        price,
      };
      const course = await this._instructorService.createCourse(courseData);
      res
        .status(HTTP_STATUS.OK)
        .json({ success: true, message: "created the course", data: course });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
    }
  }

  async updateCourse(req: Request, res: Response): Promise<void> {
    try {
      const courseId = req.params.courseId;

      const updatedCourse = await this._instructorService.updateCourse(
        courseId,
        req.body
      );
      res
        .status(HTTP_STATUS.OK)
        .json({
          success: true,
          message: "updated the course",
          data: updatedCourse,
        });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
    }
  }


  async fetchAllCourses(req: AuthRequest, res: Response): Promise<void> {
    try {
      res.set('Cache-Control', 'no-store');
      if (!req.user) {
        res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json({ success: false, message: "Unauthorized: No user data" });
        return;
      }
      if (req.user.role !== Role.Instructor || !req.user.id) {
        throwError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized: Only instructors can fetch courses");
      }
      const instructorId = req.user.id;
      const { page = "1", limit = "6", search = "" } = req.query as QueryParams;

      const coursesData = await this._instructorService.fetchAllCourses(
        instructorId,
        parseInt(page),
        parseInt(limit),
        search
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Fetched all courses",
        data: coursesData?.courses,
        totalPages: coursesData?.totalPages,
        totalCourses: coursesData?.totalCourses,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
    }
  }

  async fetchSingleCourse(req: AuthRequest, res: Response): Promise<void> {
    try {
      const courseId = req.params.courseId;

      const course = await this._instructorService.fetchCourse(courseId);
      if (!course) {
        throwError(404, "Course not found");
      }
      res
        .status(HTTP_STATUS.OK)
        .json({ success: true, message: "fetch single course", data: course });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
    }
  }

  async getPresignedUrl(req: Request, res: Response): Promise<void> {
    try {
      const { fileName, fileType } = req.body;
      if (!fileName || !fileType) {
        throwError(HTTP_STATUS.BAD_REQUEST, "Missing fileName or fileType");
      }
      const { presignedUrl, videoUrl } =
        await this._instructorService.getPresignedUrl(fileName, fileType);

      res.json({ presignedUrl, videoUrl });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
    }
  }

  async addLesson(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || req.user.role !== Role.Instructor || !req.user.id) {
        res
          .status(HTTP_STATUS.FORBIDDEN)
          .json({
            success: false,
            message: "Forbidden: Only instructors can add lesson",
          });
        return;
      }

      const { title, description, thumbnail, pdf, video, course } = req.body;

      const instructorId = req.user.id;
      if (!title || !description || !thumbnail || !video || !course) {
        throw new Error("invalid credentials");
      }

      const lessonData = {
        title,
        description,
        thumbnail,
        instructor: instructorId,
        pdf,
        video,
        course,
      };
      const lesson = await this._instructorService.addLesson(lessonData);
      res
        .status(HTTP_STATUS.OK)
        .json({
          success: true,
          message: "created the lesson",
          data: { lessonId: lesson?._id },
        });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
    }
  }

  async fetchAllLessons(req: AuthRequest, res: Response): Promise<void> {
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
        res.status(404).json({ success: false, message: "No lessons found" });
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

  async fetchSingleLesson(req: AuthRequest, res: Response): Promise<void> {
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
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
    }
  }

  async updateLesson(req: Request, res: Response): Promise<void> {
    try {
      const lessonId = req.params.lessonId;

      const updatedLesson = await this._instructorService.updateLesson(
        lessonId,
        req.body
      );
      res
        .status(HTTP_STATUS.OK)
        .json({
          success: true,
          message: "updated the lesson",
          data: updatedLesson,
        });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
    }
  }

  async publishCourse(req: Request, res: Response): Promise<void> {
    try {
      const courseId = req.params.courseId;

      const publishedCourse = await this._instructorService.publishCourse(
        courseId
      );
      res
        .status(HTTP_STATUS.OK)
        .json({
          success: true,
          message: "published the course",
          data: publishedCourse,
        });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
    }
  }

  async addOrUpdateAssessment(req: Request, res: Response): Promise<void> {
    try {
      const { lessonId } = req.params;
      const { questions } = req.body;

      const lesson = await this._instructorService.addAssessment(lessonId, questions);
      res
        .status(HTTP_STATUS.OK)
        .json({ message: "Assessment saved successfully", lesson });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server error", error });
    }
  }

  async getInstructorProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const instructorProfile =
        await this._instructorService.fetchInstructorProfile(userId);

      res
        .status(HTTP_STATUS.OK)
        .json({
          success: true,
          message: "instructor profile fetched successfully!",
          data: instructorProfile,
        });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const updateData = req.body;

      const updatedInstructor =
        await this._instructorService.updateInstructorProfile(
          userId,
          updateData
        );

      if (!updatedInstructor) {
        throwError(HTTP_STATUS.BAD_REQUEST, "update instructor error");
      }

      res.status(HTTP_STATUS.OK).json({ success: true, data: updatedInstructor });
    } catch (error) {
      console.error("Error in InstructorController.updateProfile:", error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: "Server error" });
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
      const presignedUrl = await this._s3Service.generatePresignedUrl(videoKey, 300); // Use S3Service directly
      console.log('presigned url',presignedUrl)
      res.status(HTTP_STATUS.OK).json({ success: true, presignedUrl });
    } catch (error) {
      console.error("Error in InstructorController :get presigned url for video", error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: "Server error" });
    }
  }

}
