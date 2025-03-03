import mongoose from "mongoose";
import { CategoryEntity } from "../interfaces/courses/category";
import { ICourse } from "../interfaces/courses/ICourse";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/awsConfig";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ILesson } from "../interfaces/courses/ILesson";
import { IInstructorRepository } from "../interfaces/user/IInstructorRepository";
import { IUser } from "../interfaces/user/IUser";
import { InstructorRepository } from "../repository/instructorRepository";

export class InstructorService {
  constructor(private instructorRepository: IInstructorRepository) {}
  // constructor(private instructorRepository: InstructorRepository) {}

  async getCategories(): Promise<CategoryEntity[]> {
    try {
      const categories = await this.instructorRepository.fetchCategories();
      if (!categories) {
        throw new Error("No categories found");
      }
      return categories;
    } catch (error) {
      console.log("instructorService error:get all categories", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async createCourse(courseData: Partial<ICourse>): Promise<ICourse | null> {
    try {
      const course = await this.instructorRepository.addCourse(courseData);

      if (!course) {
        throw new Error("No course found");
      }
      return course;
    } catch (error) {
      console.log("instructorService error: create course", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async updateCourse(
    courseId: string,
    courseData: Partial<ICourse>
  ): Promise<ICourse | null> {
    try {
      const course = await this.instructorRepository.editCourse(
        courseId,
        courseData
      );

      if (!course) {
        throw new Error("No course found");
      }
      return course;
    } catch (error) {
      console.log("instructorService error: update course", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async fetchAllCourses(
    instructorId: mongoose.Types.ObjectId
  ): Promise<ICourse[] | null> {
    try {
      const courses = await this.instructorRepository.getAllCoursesByInstructor(
        instructorId
      );

      if (!courses) {
        throw new Error("No courses found");
      }
      return courses;
    } catch (error) {
      console.log("instructorService error: update courses", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async fetchCourse(courseId: string): Promise<ICourse | null> {
    try {
      return await this.instructorRepository.getSingleCourse(courseId);
    } catch (error) {
      console.log("instructorService error: fetch course", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async getPresignedUrl(
    fileName: string,
    fileType: string
  ): Promise<{ presignedUrl: string; videoUrl: string }> {
    try {
      const key = `course/${Date.now()}-${encodeURIComponent(fileName)}`;
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        ContentType: fileType,
      });

      // Generate a signed URL for uploading
      const presignedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 60,
      });

      // Construct the final image URL
      const videoUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      console.log("Generated Image URL:", videoUrl);
      return { presignedUrl, videoUrl };
    } catch (error) {
      console.error("S3Service Error: Presigned URL generation failed", error);
      throw new Error(
        `Error generating presigned URL: ${(error as Error).message}`
      );
    }
  }

  async addLesson(lessonData: Partial<ILesson>): Promise<ILesson | null> {
    try {
      const lesson = await this.instructorRepository.addLesson(lessonData);

      if (!lesson) {
        throw new Error("No lesson found");
      }
      return lesson;
    } catch (error) {
      console.log("instructorService error: create lesson", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async allLessons(
    courseId: string
  ): Promise<ILesson[] | null> {
    try {
      const lessons = await this.instructorRepository.courseLessons(
        courseId
      );

      if (!lessons || lessons.length===0) {
        throw new Error("No lessons found in this course");
      }
      return lessons;
    } catch (error) {
      console.log("instructorService error: fetching lessons", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async fetchLesson(lessonId: string): Promise<ILesson | null> {
    try {
      return await this.instructorRepository.getSingleLesson(lessonId);
    } catch (error) {
      console.log("instructorService error: fetch lesson", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async updateLesson(
    lessonId: string,
    updateData: Partial<ILesson>
  ): Promise<ILesson | null> {
    try {
      const lesson = await this.instructorRepository.editLesson(
        lessonId,
        updateData
      );

      if (!lesson) {
        throw new Error("No lesson found");
      }
      return lesson;
    } catch (error) {
      console.log("instructorService error: update lesson", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async publishCourse(
    courseId: string
  ): Promise<ICourse | null> {
    try {
      const course = await this.instructorRepository.publishCourse(
        courseId,
      );

      if (!course) {
        throw new Error("No course found");
      }
      return course;
    } catch (error) {
      console.log("instructorService error: publish course", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async fetchInstructorProfile(userId: string): Promise<IUser | null> {
    try {
      const instructor = await this.instructorRepository.getInstructorProfile(userId);
      if (!instructor) {
          throw new Error("Instructor not found");
      }
      return instructor;
    } catch (error) {
      console.log("instructorService error: instructor profile", error);
      throw new Error(`${(error as Error).message}`);
    }
}

  async updateInstructorProfile(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    try {
      const instructor = await this.instructorRepository.updateInstructor(userId, updateData);
      if (!instructor) {
        throw new Error('Instructor not found');
      }
      return instructor;
    } catch (error) {
      console.log("instructorService error: instructor profile updating", error);
      throw new Error(`${(error as Error).message}`);
    }
  }
}
