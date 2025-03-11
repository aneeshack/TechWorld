import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { UserRepository } from "../repository/userRepository";
import { IUserService } from "../interfaces/user/IUserService";
import mongoose from "mongoose";

export class UserController {

  constructor(private userService: IUserService){};
  // constructor(private userService: UserService){};

async getFilteredCourses(req: Request, res: Response): Promise<void> {
  try {
    const { searchTerm, categories, priceMin, priceMax, sortOrder, page, limit } = req.query;
    console.log('req.queries', req.query);

    const validSortOrder = (order: unknown): "" | "asc" | "desc" | undefined => {
      if (typeof order !== "string") return "";
      if (order === "" || order === "asc" || order === "desc") return order;
      return "";
    };

    let categoryIds: string[] = [];
    if (categories) {
      if (typeof categories === "string") {
        categoryIds = categories.split(",").map(id => id.trim());
      } else if (Array.isArray(categories)) {
        categoryIds = categories.map(id => String(id).trim());
      }
    }
    categoryIds = categoryIds.filter(id => mongoose.Types.ObjectId.isValid(id));

    const parsedPriceMin = priceMin ? parseInt(priceMin as string) : undefined;
    const parsedPriceMax = priceMax ? parseInt(priceMax as string) : undefined;
    const parsedPage = page ? parseInt(page as string) : 1; // Default to page 1
    const parsedLimit = limit ? parseInt(limit as string) : 10; // Default to 10 items per page

    const filters = {
      searchTerm: searchTerm as string || "",
      categoryIds,
      priceMin: parsedPriceMin !== undefined && !isNaN(parsedPriceMin) ? parsedPriceMin : undefined,
      priceMax: parsedPriceMax !== undefined && !isNaN(parsedPriceMax) ? parsedPriceMax : undefined,
      sortOrder: validSortOrder(sortOrder),
      page: parsedPage,
      limit: parsedLimit,
    };

    const result = await this.userService.getFilteredCourses(
      filters.searchTerm,
      filters.categoryIds,
      filters.priceMin,
      filters.priceMax,
      filters.sortOrder,
      filters.page,
      filters.limit
    );

    res.status(200).json({
      success: true,
      data: result.courses,
      total: result.total,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(result.total / parsedLimit),
    });
  } catch (error) {
    console.error("Error fetching filtered courses:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}


async getAllCourses(req: Request, res: Response): Promise<void> {
  try {

    const courses = await this.userService.getAllCourses();
    if (!courses) {
      res.status(404).json({ success: false, message: "Courses not found" });
      return;
    }
    res.status(200).json({ success: true, message: "Fetched courses", data: courses });
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

}
