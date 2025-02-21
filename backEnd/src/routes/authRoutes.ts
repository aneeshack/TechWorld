import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { authenticateUser } from "../middlewares/authMiddleware";

const authRouter = Router();
const authController = new AuthController();

authRouter.get('/fetchUser',authenticateUser, authController.fetchUser.bind(authController));
authRouter.post('/signup', authController.signup.bind(authController));
authRouter.post('/resendOtp', authController.resendOtp.bind(authController));
authRouter.post('/verifyOtp', authController.verifyOtp.bind(authController));
authRouter.delete('/logout', authController.logout.bind(authController));
authRouter.post('/login', authController.login.bind(authController));
authRouter.post('/googleAuth', authController.googleAuthentication.bind(authController));
authRouter.post('/register', authController.registerInstructor.bind(authController));
authRouter.post('/forgotPass', authController.forgotPassword.bind(authController));
authRouter.patch('/resetPass', authController.resetPassword.bind(authController));

export default authRouter;