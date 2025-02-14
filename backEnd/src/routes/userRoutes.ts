import { Router } from "express";
import { UserController } from "../controllers/userController";
import { authenticateUser } from "../middlewares/authMiddleware";

const userRouter = Router();
const userController = new UserController();

userRouter.get('/fetchUser',authenticateUser, userController.fetchUser.bind(userController));
userRouter.post('/signup', userController.signup.bind(userController));
userRouter.post('/resendOtp', userController.resendOtp.bind(userController));
userRouter.post('/verifyOtp', userController.verifyOtp.bind(userController));
userRouter.delete('/logout', userController.logout.bind(userController));
userRouter.post('/login', userController.login.bind(userController));
userRouter.post('/googleAuth', userController.googleAuthentication.bind(userController));
userRouter.post('/register', userController.registerInstructor.bind(userController));
userRouter.post('/forgotPass', userController.forgotPassword.bind(userController));
userRouter.patch('/resetPass', userController.resetPassword.bind(userController));

export default userRouter;