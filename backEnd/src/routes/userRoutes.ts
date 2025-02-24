import { Router } from "express";
import { UserController } from "../controllers/userController";
import { authenticateUser } from "../middlewares/authMiddleware";

const userRouter = Router();
const userController = new UserController();

userRouter.get('/courses', userController.fetchAllCourses.bind(userController));
userRouter.get('/course/:courseId', userController.fetchSingleCourse.bind(userController));
userRouter.post('/course/payment', authenticateUser, userController.processPayment.bind(userController));

export default userRouter;
