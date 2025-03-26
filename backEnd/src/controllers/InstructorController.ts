import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { Role } from "../interfaces/database/IUser";
import { IInstructorService } from "../interfaces/instructor/IInstructorService";


export class InstructorController {
  constructor(
    private _instructorService: IInstructorService,
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
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async createCourse(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || req.user.role !== Role.Instructor || !req.user.id) {
        res
          .status(403)
          .json({
            success: false,
            message: "Forbidden: Only instructors can create courses",
          });
        return;
      }

      const { title, description, thumbnail, category, price } = req.body;

      const instructorId = req.user.id;
      if (!title || !description || !thumbnail || !category || !price) {
        throw new Error("invalid credentials");
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
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
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
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
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
        res
          .status(401)
          .json({ success: false, message: "Unauthorized: No user data" });
        return;
      }
      const instructorId = req.user.id;

      const courses = await this._instructorService.fetchAllCourses(
        instructorId
      );
      res
        .status(200)
        .json({ success: true, message: "fetch all course", data: courses });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async fetchSingleCourse(req: AuthRequest, res: Response): Promise<void> {
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

  async getPresignedUrl(req: Request, res: Response): Promise<void> {
    try {
      const { fileName, fileType } = req.body;
      if (!fileName || !fileType) {
        res
          .status(400)
          .json({ success: false, message: "Missing fileName or fileType" });
        return;
      }
      const { presignedUrl, videoUrl } =
        await this._instructorService.getPresignedUrl(fileName, fileType);

      res.json({ presignedUrl, videoUrl });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
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
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
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
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
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
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
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
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
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
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
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
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
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
        res
          .status(404)
          .json({ success: false, message: "Instructor not found" });
        return;
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
  
      const presignedUrl = await this._instructorService.getPresignedUrlForVideo(lessonId)
     
      res.json({ presignedUrl });
    } catch (error) {
      console.error("Error in InstructorController :get presigned url for video", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

}
