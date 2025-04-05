"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentAuth_1 = require("../middlewares/studentAuth");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const userContainer_1 = require("../containers/userContainer");
const types_1 = require("../interfaces/types");
const userRouter = (0, express_1.Router)();
const userController = userContainer_1.userContainer.get(types_1.USER_TYPES.UserController);
const paymentLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5, // Limit each IP to 5 payment attempts per window
});
userRouter.get('/courses', userController.getFilteredCourses.bind(userController));
userRouter.get('/allCourses', userController.getAllCourses.bind(userController));
userRouter.get('/course/:courseId', userController.fetchSingleCourse.bind(userController));
userRouter.get('/categories', userController.getAllCategories.bind(userController));
userRouter.get('/reviews/fetch/:courseId', userController.getCourseReviews.bind(userController));
// payment
userRouter.post('/payment/process', studentAuth_1.authenticateStudent, paymentLimiter, userController.createPaymentSession.bind(userController));
userRouter.get('/payment/status/:sessionId', studentAuth_1.authenticateStudent, userController.getPaymentSession.bind(userController));
userRouter.post('/course/enrolled', studentAuth_1.authenticateStudent, userController.courseEnrollment.bind(userController));
exports.default = userRouter;
