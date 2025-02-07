import { Router } from "express";
import { UserController } from "../controllers/userController";

const userRouter = Router();
const userController = new UserController();

userRouter.post('/signup', userController.signup.bind(userController));
userRouter.post('/verifyOtp', userController.verifyOtp.bind(userController));
userRouter.delete('/logout', userController.logout.bind(userController));
userRouter.post('/login', userController.login.bind(userController));
userRouter.post('/register', userController.registerInstructor.bind(userController));

export default userRouter;