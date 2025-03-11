import { Router } from "express";
import { UserController } from "../controllers/userController";
import { authenticateUser } from "../middlewares/authMiddleware";
import { UserRepository } from "../repository/userRepository";
import { AuthService } from "../services/authService";
import { UserService } from "../services/userService";
import { authenticateStudent } from "../middlewares/studentAuth";

const userRouter = Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository)
const userController = new UserController(userService);

userRouter.get('/courses', userController.getFilteredCourses.bind(userController));
userRouter.get('/allCourses', userController.getAllCourses.bind(userController));
userRouter.get('/course/:courseId', userController.fetchSingleCourse.bind(userController));
userRouter.get('/categories', userController.getAllCategories.bind(userController));


// payment
userRouter.post('/payment/process', authenticateStudent, userController.createPaymentSession.bind(userController));
userRouter.get('/payment/status/:sessionId', authenticateStudent, userController.getPaymentSession.bind(userController));
userRouter.post('/course/enrolled', authenticateStudent, userController.couresEnrollment.bind(userController));

export default userRouter;
