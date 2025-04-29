import { Router } from "express";

import { authenticateStudent } from "../middlewares/studentAuth";
import { StudentRepository } from "../repository/studentRepository";
import { StudentService } from "../services/studentService";
import { StudentController } from "../controllers/studentController";
import { instructorService } from "./instructorRoutes";

const studentRouter = Router();
const studentRepository = new StudentRepository();
export const studentService = new StudentService(studentRepository)
const studentController = new StudentController(studentService, instructorService);


studentRouter.get('/profile/:userId',authenticateStudent, studentController.getProfile.bind(studentController));
studentRouter.put('/profile/:userId',authenticateStudent, studentController.updateProfile.bind(studentController));
studentRouter.get('/payment/:userId',authenticateStudent, studentController.getStudentPayments.bind(studentController));

studentRouter.get('/course/:courseId',authenticateStudent, studentController.fetchSingleCourse.bind(studentController));
studentRouter.get('/lessons/:courseId',authenticateStudent, studentController.fetchAllLessons.bind(studentController));
studentRouter.get('/lesson/getPresignedUrlForVideo/:lessonId',authenticateStudent, studentController.presSignedUrlForVideo.bind(studentController));
studentRouter.get('/lesson/:lessonId',authenticateStudent, studentController.fetchSingleLesson.bind(studentController));
studentRouter.post('/enrollment/update/updateProgress',authenticateStudent, studentController.updateLessonProgress.bind(studentController));

studentRouter.get('/enrolled/:userId', authenticateStudent, studentController.fetchEnrolledCourses.bind(studentController));
studentRouter.get('/enrollment/:courseId', authenticateStudent, studentController.getEnrollment.bind(studentController));

studentRouter.post('/review/add/:courseId', authenticateStudent, studentController.updateReview.bind(studentController));
studentRouter.post('/review/get/:courseId', authenticateStudent, studentController.getStudentReview.bind(studentController));


studentRouter.post('/course/finalExam/:courseId', authenticateStudent, studentController.submitFinalExam.bind(studentController));

export default studentRouter;