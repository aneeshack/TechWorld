import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { authenticateUser } from "../middlewares/authMiddleware";
import { AUTH_TYPES } from "../interfaces/types";
import { authContainer } from "../containers/authContainer";

const authRouter = Router();


const authController = authContainer.get<AuthController>(AUTH_TYPES.AuthController);

authRouter.get('/fetchUser',authenticateUser, authController.fetchUser.bind(authController));
authRouter.post('/signup', authController.signup.bind(authController));
authRouter.post('/resendOtp', authController.resendOtp.bind(authController));
authRouter.post('/verifyOtp', authController.verifyOtp.bind(authController));
authRouter.delete('/logout',authenticateUser, authController.logout.bind(authController));
authRouter.post('/login', authController.login.bind(authController));
authRouter.post('/googleAuth', authController.googleAuthentication.bind(authController));
authRouter.post('/register', authController.registerInstructor.bind(authController));
authRouter.post('/forgotPass', authController.forgotPassword.bind(authController));
authRouter.patch('/resetPass', authController.resetPassword.bind(authController));
authRouter.post('/verifyForgotPasswordOtp', authController.verifyForgotPasswordOtp.bind(authController));

export default authRouter;