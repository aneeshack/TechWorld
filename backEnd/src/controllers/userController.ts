import { Request, Response } from "express";
import { IUserService } from "../interfaces/user/IUserService";
import mongoose from "mongoose";
import { reviewModel } from "../models/reviewModel";
import { paymentModel } from "../models/paymentModel";
import { throwError } from "../middlewares/errorMiddleware";
import { inject, injectable } from "inversify";
import { USER_TYPES } from "../interfaces/types";

@injectable()
export class UserController {

  // constructor(private _userService: IUserService){};
  constructor(@inject(USER_TYPES.UserService) private _userService: IUserService){};

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

    const result = await this._userService.getFilteredCourses(
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

    const courses = await this._userService.getAllCourses();
    if (!courses) {
     throwError(400,'no course found')
    }
    res.status(200).json({ success: true, message: "Fetched courses", data: courses });
  }catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(400).json({ success:false, message: message })
  }
}

  async fetchSingleCourse(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const course = await this._userService.getSingleCourse(courseId);
      if (!course) {
        throwError(400,'no course found')
      }
      res.status(200).json({ success: true, message: "Fetched course", data: course });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(400).json({ success:false, message: message })
    }
  }

  async getAllCategories(req:Request, res: Response):Promise<void>{
    try {
        const allCategories = await this._userService.getAllCategories()
        res.status(201).json({ success: true, data:allCategories });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(400).json({ success:false, message: message })
    }
}
  
async getCourseReviews(req:Request, res: Response):Promise<void>{
  try {
    const { courseId } = req.params;
    const reviews = await reviewModel.find({ courseId })
    .populate('studentId', 'userName')
    .lean();
      res.status(201).json({ success: true, data:reviews });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(400).json({ success:false, message: message })
  }
}

  async createPaymentSession(req: Request, res: Response):Promise<void> {
    try {
      const { userId, courseId, amount, courseName, courseThumbnail } = req.body;
      
      if (!userId || !courseId || !amount || !courseName || !courseThumbnail) {
        res.status(400).json({ success: false, message: "Missing required fields" });
        return
      }
      
      // Quick check before proceeding
    const existingPayment = await paymentModel.findOne({ userId, courseId });
    if (existingPayment) {
       res.status(400).json({ 
        success: false, 
        message: "You have already purchased this course" 
      });
      return
    }
      const session = await this._userService.initiatePayment(
        userId,
        courseId,
        amount,
        courseName,
        courseThumbnail
      );
      res.json({ success: true,message:'session created', data: session });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(400).json({ success:false, message: message })
    }
  };
  
 async getPaymentSession (req: Request, res: Response):Promise<void> {
    try {
      const { sessionId } = req.params;
  
      if (!sessionId) {
         res.status(400).json({ success: false, message: "Session ID required" });
         return
      }
  
      const session = await this._userService.getPaymentStatus(sessionId);
  
      res.json({ success: true, data: session });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(400).json({ success:false, message: message })
    }
}

async courseEnrollment(req: Request, res: Response):Promise<void> {
  try {
    const { userId, courseId, sessionId,completionStatus,amount, enrolledAt } = req.body;

    if (!userId || !courseId || !sessionId || !completionStatus || !amount|| !enrolledAt ) {
       res.status(400).json({ success: false, message: "Missing required fields." });
       return
    }

    const enrollment = await this._userService.courseEnroll(userId, courseId, completionStatus, amount, enrolledAt);

    if (!enrollment) {
      res.status(500).json({ success: false, message: "Enrollment failed." });
      return
       
    } 

    res.status(201).json({ success: true, message: "Enrollment successful.", enrollment });
  }catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Enrollment error:", error);
      res.status(400).json({ success:false, message: message })
  } 
}

}
