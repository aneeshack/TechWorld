import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { UserRepository } from "../repository/userRepository";

export class UserController {
  private userService: UserService;

  constructor(){
    this.userService = new UserService(new UserRepository);
  }

  async fetchAllCourses(req: Request, res: Response): Promise<void> {
    try {
      const courses = await this.userService.getAllCourses();
      res.status(200).json({ success: true, message: "Fetched all courses", data: courses });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async fetchSingleCourse(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const course = await this.userService.getSingleCourse(courseId);
      if (!course) {
        res.status(404).json({ success: false, message: "Course not found" });
        return;
      }
      res.status(200).json({ success: true, message: "Fetched course", data: course });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAllCategories(req:Request, res: Response):Promise<void>{
    try {
        const allCategories = await this.userService.getAllCategories()
        console.log('all categories',allCategories)
        res.status(201).json({ success: true, data:allCategories });
    } catch (error:any) {
        res.status(400).json({success: false, message: error.message })
    }
}
  
  async createPaymentSession(req: Request, res: Response):Promise<void> {
    try {
      console.log('create payment session',req.body)
      const { userId, courseId, amount, courseName, courseThumbnail } = req.body;
      
      if (!userId || !courseId || !amount || !courseName || !courseThumbnail) {
        res.status(400).json({ success: false, message: "Missing required fields" });
        return
      }
      
      const session = await this.userService.initiatePayment(
        userId,
        courseId,
        amount,
        courseName,
        courseThumbnail
      );
      console.log('session id in controller', session)
      res.json({ success: true,message:'session created', data: session });
    } catch (error:any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
 async getPaymentSession (req: Request, res: Response):Promise<void> {
    try {
      const { sessionId } = req.params;
  
      if (!sessionId) {
         res.status(400).json({ success: false, message: "Session ID required" });
         return
      }
  
      const session = await this.userService.getPaymentStatus(sessionId);
  
      res.json({ success: true, data: session });
    } catch (error:any) {
      res.status(500).json({ success: false, message: error.message });
    }
}

async couresEnrollment(req: Request, res: Response):Promise<void> {
  try {
    const { userId, courseId, sessionId,completionStatus,amount, enrolledAt } = req.body;

    if (!userId || !courseId || !sessionId || !completionStatus || !amount|| !enrolledAt ) {
       res.status(400).json({ success: false, message: "Missing required fields." });
       return
    }

    const enrollment = await this.userService.courseEnroll(userId, courseId, completionStatus, amount, enrolledAt);

    if (!enrollment) {
      res.status(500).json({ success: false, message: "Enrollment failed." });
      return
       
    } 

    res.status(201).json({ success: true, message: "Enrollment successful.", enrollment });
  } catch (error:any) {
    console.error("Enrollment error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

async fetchEnrolledCourses(req: Request, res: Response): Promise<void> {
  try {
    console.log('inside fetch enrolled course')
    const { userId } = req.params; 

    if (!userId) {
      res.status(400).json({ success: false, message: "User ID is required" });
      return;
    }

    const enrolledCourses = await this.userService.getEnrolledCourses(userId);

    res.status(200).json({ success: true, message: "Fetched enrolled courses", data: enrolledCourses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

}
