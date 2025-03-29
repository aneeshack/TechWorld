import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { Role } from "../interfaces/database/IUser";
import { IInstructorService } from "../interfaces/instructor/IInstructorService";
import S3Service from "../services/s3Service";
import { throwError } from "../middlewares/errorMiddleware";


export class InstructorController {
  constructor(
    private _instructorService: IInstructorService,
     private _s3Service: S3Service = new S3Service()
  ) {}

  async fetchCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this._instructorService.getCategories();
      res
        .status(200)
        .json({
          success: true,
          message: "fetch all categories",
          data: categories,
        });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(400).json({ success:false, message: message })
    }
  }

  async createCourse(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || req.user.role !== Role.Instructor || !req.user.id) {
       return throwError(403, "Forbidden: Only instructors can create courses");
      }

      const { title, description, thumbnail, category, price } = req.body;

      const instructorId = req.user.id;
      if (!title || !description || !thumbnail || !category || !price) {
        throwError(400, "Invalid credentials: All fields are required");
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
        .status(200)
        .json({ success: true, message: "created the course", data: course });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(400).json({ success:false, message: message })
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
        .status(200)
        .json({
          success: true,
          message: "updated the course",
          data: updatedCourse,
        });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(400).json({ success:false, message: message })
    }
  }

  async fetchAllCourses(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, message: "Unauthorized: No user data" });
        return;
      }
      if (req.user.role !== Role.Instructor || !req.user.id) {
        throwError(401, "Unauthorized: Only instructors can fetch courses");
      }
      const instructorId = req.user.id;

      const courses = await this._instructorService.fetchAllCourses(
        instructorId
      );
      res
        .status(200)
        .json({ success: true, message: "fetch all course", data: courses });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(400).json({ success:false, message: message })
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
        .status(200)
        .json({ success: true, message: "fetch single course", data: course });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(400).json({ success:false, message: message })
    }
  }

  async getPresignedUrl(req: Request, res: Response): Promise<void> {
    try {
      const { fileName, fileType } = req.body;
      if (!fileName || !fileType) {
        throwError(400, "Missing fileName or fileType");
      }
      const { presignedUrl, videoUrl } =
        await this._instructorService.getPresignedUrl(fileName, fileType);

      res.json({ presignedUrl, videoUrl });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(400).json({ success:false, message: message })
    }
  }

  async addLesson(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || req.user.role !== Role.Instructor || !req.user.id) {
        res
          .status(403)
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
        .status(200)
        .json({
          success: true,
          message: "created the lesson",
          data: { lessonId: lesson?._id },
        });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(400).json({ success:false, message: message })
    }
  }

  async fetchAllLessons(req: AuthRequest, res: Response): Promise<void> {
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(400).json({ success:false, message: message })
    }
  }

  async fetchSingleLesson(req: AuthRequest, res: Response): Promise<void> {
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(400).json({ success:false, message: message })
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
        .status(200)
        .json({
          success: true,
          message: "updated the lesson",
          data: updatedLesson,
        });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(400).json({ success:false, message: message })
    }
  }

  async publishCourse(req: Request, res: Response): Promise<void> {
    try {
      const courseId = req.params.courseId;

      const publishedCourse = await this._instructorService.publishCourse(
        courseId
      );
      res
        .status(200)
        .json({
          success: true,
          message: "published the course",
          data: publishedCourse,
        });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(400).json({ success:false, message: message })
    }
  }

  async addOrUpdateAssessment(req: Request, res: Response): Promise<void> {
    try {
      const { lessonId } = req.params;
      const { questions } = req.body;

      const lesson = await this._instructorService.addAssessment(lessonId, questions);
      res
        .status(200)
        .json({ message: "Assessment saved successfully", lesson });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }

  async getInstructorProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const instructorProfile =
        await this._instructorService.fetchInstructorProfile(userId);

      res
        .status(200)
        .json({
          success: true,
          message: "instructor profile fetched successfully!",
          data: instructorProfile,
        });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(400).json({ success:false, message: message })
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
        throwError(400, "update instructor error");
      }

      res.status(200).json({ success: true, data: updatedInstructor });
    } catch (error) {
      console.error("Error in InstructorController.updateProfile:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async presSignedUrlForVideo(req: Request, res: Response): Promise<void> {
    try {
      const { lessonId } = req.params;

      const lesson = await this._instructorService.fetchLesson(lessonId); 
      if (!lesson || !lesson.video) {
        res.status(404).json({ success: false, message: "Lesson or video not found" });
        return;
      }

      const videoKey = lesson.video.split(".amazonaws.com/")[1]; // Extract S3 key from URL
      const presignedUrl = await this._s3Service.generatePresignedUrl(videoKey, 300); // Use S3Service directly
      console.log('presigned url',presignedUrl)
      res.status(200).json({ success: true, presignedUrl });
    } catch (error) {
      console.error("Error in InstructorController :get presigned url for video", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

}
