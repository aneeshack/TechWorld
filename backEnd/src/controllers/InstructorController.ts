import { Request, Response } from "express";
import { InstructorRepository } from "../repository/instructorRepository";
import { InstructorService } from "../services/instructorService";
import { AuthRequest } from "../middlewares/authMiddleware";
import { Role } from "../interfaces/user/IUser";
import { lessonModel } from "../models/lessonModel";
import { IInstructorService } from "../interfaces/user/IInstructorService";

export class InstructorController {

   //  constructor(private instructorService: IInstructorService){}
    constructor(private instructorService: InstructorService){}

    async fetchCategories (req: Request, res: Response):Promise<void>{
       try {
        console.log('inside fetch category')
        const categories = await this.instructorService.getCategories()
        res.status(200).json({ success: true, message:"fetch all categories", data:categories });
       } catch (error:any) {
        res.status(400).json({success: false, message: error.message })
       }

    }

    async createCourse (req: AuthRequest, res: Response):Promise<void>{
        try { 
         console.log('inside create course')

         if(!req.user || req.user.role!==Role.Instructor || !req.user.id){
            res.status(403).json({ success: false, message: "Forbidden: Only instructors can create courses" });
            return;
         }

         const {title, description,thumbnail,category, price} = req.body
         
         const instructorId = req.user.id;
         if(!title || !description ||!thumbnail || !category || !price){
            throw new Error('invalid credentials')
         }

         const courseData = {
            title, 
            description,
            thumbnail, 
            instructor:instructorId, 
            category, 
            price
         }
         console.log('coursedtae',courseData)
         const course = await this.instructorService.createCourse(courseData)
         res.status(200).json({ success: true, message:"created the course", data:course });
        } catch (error:any) {
         res.status(400).json({success: false, message: error.message })
        }
     }

     async updateCourse (req: Request, res: Response):Promise<void>{
        try { 
         console.log('inside update course')
         const courseId = req.params.courseId;

         const updatedCourse = await this.instructorService.updateCourse(courseId, req.body)
         res.status(200).json({ success: true, message:"updated the course", data:updatedCourse });
        } catch (error:any) {
         res.status(400).json({success: false, message: error.message })
        }
     }

     async fetchAllCourses (req: AuthRequest, res: Response):Promise<void>{
        try { 
         console.log('inside fetch all courses')
         if(!req.user){
             res.status(401).json({ success: false, message: "Unauthorized: No user data" });
             return
         }
         if(req.user.role !== Role.Instructor || !req.user.id){
            res.status(401).json({ success: false, message: "Unauthorized: No user data" });
            return
         }
         const instructorId = req.user.id;

         const courses = await this.instructorService.fetchAllCourses(instructorId)
         res.status(200).json({ success: true, message:"fetch all course", data:courses });
        } catch (error:any) {
         res.status(400).json({success: false, message: error.message })
        }
     }

     async fetchSingleCourse (req: AuthRequest, res: Response):Promise<void>{
      try { 
       console.log('inside fetch course')

       const courseId = req.params.courseId;

       const course = await this.instructorService.fetchCourse(courseId)
       if (!course) {
          res.status(404).json({ success: false, message: "Course not found" });
          return
     }
       res.status(200).json({ success: true, message:"fetch single course", data:course });
      } catch (error:any) {
       res.status(400).json({success: false, message: error.message })
      }
   }

   async getPresignedUrl(req:Request, res: Response):Promise<void>{
      try {
          console.log('inside presigned url')

          const { fileName, fileType } = req.body
          console.log('req.body',fileName,fileType)
          if (!fileName || !fileType) {
             res.status(400).json({ success: false, message: "Missing fileName or fileType" });
             return
          }
          const { presignedUrl, videoUrl} = await this.instructorService.getPresignedUrl(fileName, fileType)

          res.json({ presignedUrl, videoUrl });
          
      } catch (error:any) {
          res.status(500).json({success: false, message: error.message});
      }
  }

  async addLesson(req: AuthRequest, res: Response):Promise<void>{
   try { 
    console.log('inside add lesson')

    if(!req.user || req.user.role!==Role.Instructor || !req.user.id){
       res.status(403).json({ success: false, message: "Forbidden: Only instructors can add lesson" });
       return;
    }

    const {title, description,thumbnail,pdf, video, course} = req.body
    
    const instructorId = req.user.id;
    if(!title || !description ||!thumbnail || !video ||!course){
       throw new Error('invalid credentials')
    }

    const lessonData = {
       title, 
       description,
       thumbnail, 
       instructor:instructorId, 
       pdf, 
       video,
       course
    }
    console.log('lesson',lessonData)
    const lesson = await this.instructorService.addLesson(lessonData)
    res.status(200).json({ success: true, message:"created the lesson", data:{ lessonId: lesson?._id } });
   } catch (error:any) {
    res.status(400).json({success: false, message: error.message })
   }
}

   async fetchAllLessons (req: AuthRequest, res: Response):Promise<void>{
      try { 
      console.log('inside fetch all lessons')

      const courseId = req.params.courseId
      if(!courseId){
         res.status(400).json({ success: false, message: "invalid credentials" });
         return;
      }

      const lessons = await this.instructorService.allLessons(courseId)
      if (!lessons || lessons.length === 0) {
         res.status(404).json({ success: false, message: "No lessons found" });
         return;
       }
      res.status(200).json({ success: true, message:"fetch all lessons", data:lessons });
      } catch (error:any) {
      res.status(400).json({success: false, message: error.message })
      }
   }

   async fetchSingleLesson (req: AuthRequest, res: Response):Promise<void>{
      try { 
       console.log('inside fetch lesson')
       const lessonId = req.params.lessonId;

       const lesson = await this.instructorService.fetchLesson(lessonId)
       if (!lesson) {
          res.status(404).json({ success: false, message: "lesson not found" });
          return
     }
       res.status(200).json({ success: true, message:"fetch single lesson", data:lesson });
      } catch (error:any) {
       res.status(400).json({success: false, message: error.message })
      }
   }

   async updateLesson (req: Request, res: Response):Promise<void>{
      try { 
       console.log('inside update lesson')
       const lessonId = req.params.lessonId;

       const updatedLesson = await this.instructorService.updateLesson(lessonId, req.body)
       res.status(200).json({ success: true, message:"updated the lesson", data:updatedLesson });
      } catch (error:any) {
       res.status(400).json({success: false, message: error.message })
      }
   }

   async publishCourse (req: Request, res: Response):Promise<void>{
      try { 
       console.log('inside publish course')
       const courseId = req.params.courseId;

       const publishedCourse = await this.instructorService.publishCourse(courseId)
       res.status(200).json({ success: true, message:"published the course", data:publishedCourse });
      } catch (error:any) {
       res.status(400).json({success: false, message: error.message })
      }
   }



 async addOrUpdateAssessment(req: Request, res: Response):Promise<void> {
      try {
         console.log('assesment')
        const { lessonId } = req.params;
      //   const { question, options } = req.body;
      console.log('lessonid',lessonId)
        const { questions } = req.body;
         console.log('ass,ques',questions,lessonId)
    
        // Validate lesson existence
        const lesson = await lessonModel.findById(lessonId);
        if (!lesson) {
           res.status(404).json({ message: "Lesson not found" });
           return
        }
    
        // Update assessment data
        lesson.assessment = questions;
        await lesson.save();
    
        res.status(200).json({ message: "Assessment saved successfully", lesson });
      } catch (error) {
        res.status(500).json({ message: "Server error", error });
      }
    };

    async getInstructorProfile(req: Request, res: Response): Promise<void> {
      try {
          const userId = req.params.userId;
          const instructorProfile = await this.instructorService.fetchInstructorProfile(userId);
          
         res.status(200).json({ success: true, message:'instructor profile fetched successfully!', data: instructorProfile });
      } catch (error:any) {
         res.status(400).json({success: false, message: error.message })
      }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
   try {
     const { userId } = req.params;
     const updateData = req.body;
 
     const updatedInstructor = await this.instructorService.updateInstructorProfile(userId, updateData);
 
     if (!updatedInstructor) {
       res.status(404).json({ success: false, message: 'Instructor not found' });
       return;
     }
 
     res.status(200).json({ success: true, data: updatedInstructor });
   } catch (error) {
     console.error('Error in InstructorController.updateProfile:', error);
     res.status(500).json({ success: false, message: 'Server error' });
   }
 }
}