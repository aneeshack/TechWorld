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

  async processPayment(req: Request, res: Response): Promise<void> {
    try {
      // Assume the request body contains: courseId, userId, and paymentInfo details
      const { courseId, userId, amount, currency } = req.body;
      const paymentIntent = await this.userService.processPayment(courseId, userId, amount, currency);
      res.status(200).json({ success: true, message: "Payment processing...", data: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async confirmPayment(req: Request, res: Response): Promise<void> {
    try {
      const { paymentIntentId, userId, courseId } = req.body;
      await this.userService.confirmPayment(paymentIntentId, userId, courseId);
      
      res.status(200).json({ success: true, message: "Payment confirmed & course enrolled!" });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
