import mongoose from "mongoose";
import { CategoryEntity } from "../interfaces/courses/category";
import { ICourse } from "../interfaces/courses/ICourse";
import { IAssessment, ILesson } from "../interfaces/courses/ILesson";
import { IInstructorRepository } from "../interfaces/instructor/IInstructorRepository";
import { IUser } from "../interfaces/database/IUser";
import S3Service from "./s3Service";

export class InstructorService {

  private _instructorRepository: IInstructorRepository;
  private _s3Service: S3Service; 

  constructor(
    instructorRepository: IInstructorRepository,
    s3Service: S3Service 
  ) {
    this._instructorRepository = instructorRepository;
    this._s3Service = s3Service;
  }

  async getCategories(): Promise<CategoryEntity[]> {
    try {
      const categories = await this._instructorRepository.fetchCategories();
      if (!categories) {
        throw new Error("No categories found");
      }
      return categories;
    } catch (error) {
      console.error("instructorService error:get all categories", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async createCourse(courseData: Partial<ICourse>): Promise<ICourse | null> {
    try {
      const course = await this._instructorRepository.addCourse(courseData);

      if (!course) {
        throw new Error("No course found");
      }
      return course;
    } catch (error) {
      console.error("instructorService error: create course", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async updateCourse(
    courseId: string,
    courseData: Partial<ICourse>
  ): Promise<ICourse | null> {
    try {
      const course = await this._instructorRepository.editCourse(
        courseId,
        courseData
      );

      if (!course) {
        throw new Error("No course found");
      }
      return course;
    } catch (error) {
      console.error("instructorService error: update course", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async fetchAllCourses(
    instructorId: mongoose.Types.ObjectId,
    page: number,
    limit: number,
    search: string
  ): Promise<{ courses: ICourse[]; totalPages: number; totalCourses: number } | null> {
    try {
      const coursesData = await this._instructorRepository.getAllCoursesByInstructor(
        instructorId,
        page,
        limit,
        search
      );
      if (!coursesData.courses.length && search) {
        throw new Error("No courses found matching the search criteria");
      }
      return coursesData;
    } catch (error) {
      console.error("instructorService error: fetch courses", error);
      throw new Error(`${(error as Error).message}`);
    }
  }
  
  async fetchCourse(courseId: string): Promise<ICourse | null> {
    try {
      return await this._instructorRepository.getSingleCourse(courseId);
    } catch (error) {
      console.error("instructorService error: fetch course", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async getPresignedUrl(
    fileName: string,
    fileType: string
  ): Promise<{ presignedUrl: string; videoUrl: string }> {
    try {
      const key = `course/${Date.now()}-${encodeURIComponent(fileName)}`;
      const result = await this._s3Service.generatePresignedUrlForUpload(key, fileType, 60);
      console.log("Generated Video URL:", result.videoUrl);
      return result;
    } catch (error) {
      console.error("InstructorService Error: Presigned URL generation failed", error);
      throw new Error(`Error generating presigned URL: ${(error as Error).message}`);
    }
  }

  async addLesson(lessonData: Partial<ILesson>): Promise<ILesson | null> {
    try {
      const lesson = await this._instructorRepository.addLesson(lessonData);

      if (!lesson) {
        throw new Error("No lesson found");
      }
      return lesson;
    } catch (error) {
      console.error("instructorService error: create lesson", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async allLessons(
    courseId: string
  ): Promise<ILesson[] | null> {
    try {
      const lessons = await this._instructorRepository.courseLessons(
        courseId
      );

      if (!lessons || lessons.length===0) {
        throw new Error("No lessons found in this course");
      }
      return lessons;
    } catch (error) {
      console.error("instructorService error: fetching lessons", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async fetchLesson(lessonId: string): Promise<ILesson | null> {
    try {
      return await this._instructorRepository.getSingleLesson(lessonId);
    } catch (error) {
      console.error("instructorService error: fetch lesson", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async updateLesson(
    lessonId: string,
    updateData: Partial<ILesson>
  ): Promise<ILesson | null> {
    try {
      const lesson = await this._instructorRepository.editLesson(
        lessonId,
        updateData
      );

      if (!lesson) {
        throw new Error("No lesson found");
      }
      return lesson;
    } catch (error) {
      console.error("instructorService error: update lesson", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async publishCourse(
    courseId: string
  ): Promise<ICourse | null> {
    try {
      const course = await this._instructorRepository.publishCourse(
        courseId,
      );

      if (!course) {
        throw new Error("No course found");
      }
      return course;
    } catch (error) {
      console.error("instructorService error: publish course", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async addAssessment(lessonId: string, questions: IAssessment[]): Promise<ILesson> {
    try {

      if (!lessonId) {
        throw new Error("Lesson ID is required");
      }
      if (!questions || !Array.isArray(questions)) {
        throw new Error("Questions must be provided as an array");
      }

      const lesson = await this._instructorRepository.getLessonById(lessonId);
      if (!lesson) {
        throw new Error("Lesson not found");
      }

      // Update assessment
      const updatedLesson = await this._instructorRepository.updateLessonAssessment(lessonId, questions);

      return updatedLesson;
    } catch (error) {
      console.error("Error in InstructorService.addOrUpdateAssessment:", error);
      throw error; // Propagate error to controller
    }
  }

  async fetchInstructorProfile(userId: string): Promise<IUser | null> {
    try {
      const instructor = await this._instructorRepository.getInstructorProfile(userId);
      if (!instructor) {
          throw new Error("Instructor not found");
      }
      return instructor;
    } catch (error) {
      console.error("instructorService error: instructor profile", error);
      throw new Error(`${(error as Error).message}`);
    }
}

  async updateInstructorProfile(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    try {
      const instructor = await this._instructorRepository.updateInstructor(userId, updateData);
      if (!instructor) {
        throw new Error('Instructor not found');
      }
      return instructor;
    } catch (error) {
      console.error("instructorService error: instructor profile updating", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

}
