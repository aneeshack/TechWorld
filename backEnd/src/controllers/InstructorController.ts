import { Request, Response } from "express";
import { InstructorRepository } from "../repository/instructorRepository";
import { InstructorService } from "../services/instructorService";
import { AuthRequest } from "../middlewares/authMiddleware";
import { Role } from "../interfaces/user/IUser";

export class InstructorController {
    private instructorService: InstructorService;

    constructor(){
        this.instructorService = new InstructorService(new InstructorRepository)
    }

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
    res.status(200).json({ success: true, message:"created the lesson", data:lesson });
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
}