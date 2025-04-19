import { Router } from "express";
import { UserController } from "../controllers/userController";
import { authenticateStudent } from "../middlewares/studentAuth";
import rateLimit from "express-rate-limit";
import { userContainer } from "../containers/userContainer";
import { USER_TYPES } from "../interfaces/types";

const userRouter = Router();

const userController = userContainer.get<UserController>(USER_TYPES.UserController)

const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
  });
  
userRouter.get('/courses', userController.getFilteredCourses.bind(userController));
userRouter.get('/allCourses', userController.getAllCourses.bind(userController));
userRouter.get('/course/:courseId', userController.fetchSingleCourse.bind(userController));
userRouter.get('/categories', userController.getAllCategories.bind(userController));
userRouter.get('/reviews/fetch/:courseId', userController.getCourseReviews.bind(userController));


// payment
userRouter.post('/payment/process', authenticateStudent,paymentLimiter, userController.createPaymentSession.bind(userController));
userRouter.get('/payment/status/:sessionId', authenticateStudent, userController.getPaymentSession.bind(userController));
userRouter.post('/course/enrolled', authenticateStudent, userController.courseEnrollment.bind(userController));

export default userRouter;
