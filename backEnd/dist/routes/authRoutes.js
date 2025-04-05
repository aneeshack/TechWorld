"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const types_1 = require("../interfaces/types");
const authContainer_1 = require("../containers/authContainer");
const authRouter = (0, express_1.Router)();
const authController = authContainer_1.authContainer.get(types_1.AUTH_TYPES.AuthController);
authRouter.get('/fetchUser', authMiddleware_1.authenticateUser, authController.fetchUser.bind(authController));
authRouter.post('/signup', authController.signup.bind(authController));
authRouter.post('/resendOtp', authController.resendOtp.bind(authController));
authRouter.post('/verifyOtp', authController.verifyOtp.bind(authController));
authRouter.delete('/logout', authMiddleware_1.authenticateUser, authController.logout.bind(authController));
authRouter.post('/login', authController.login.bind(authController));
authRouter.post('/googleAuth', authController.googleAuthentication.bind(authController));
authRouter.post('/register', authController.registerInstructor.bind(authController));
authRouter.post('/forgotPass', authController.forgotPassword.bind(authController));
authRouter.patch('/resetPass', authController.resetPassword.bind(authController));
authRouter.post('/verifyForgotPasswordOtp', authController.verifyForgotPasswordOtp.bind(authController));
exports.default = authRouter;
