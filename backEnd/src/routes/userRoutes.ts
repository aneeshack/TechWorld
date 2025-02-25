import { Router } from "express";
import { UserController } from "../controllers/userController";
import { authenticateUser } from "../middlewares/authMiddleware";

const userRouter = Router();
const userController = new UserController();

userRouter.get('/courses', userController.fetchAllCourses.bind(userController));
userRouter.get('/course/:courseId', userController.fetchSingleCourse.bind(userController));
userRouter.get('/categories', userController.getAllCategories.bind(userController));


// payment
userRouter.post('/payment/process', authenticateUser, userController.createPaymentSession.bind(userController));
userRouter.get('/payment/status/:sessionId', authenticateUser, userController.getPaymentSession.bind(userController));
userRouter.post('/course/enrolled', authenticateUser, userController.couresEnrollment.bind(userController));
userRouter.get('/enrolled/:userId', authenticateUser, userController.fetchEnrolledCourses.bind(userController));

export default userRouter;
