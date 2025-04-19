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
studentRouter.post('/enrollment/updateProgress',authenticateStudent, studentController.updateLessonProgress.bind(studentController));

// studentRouter.get('/enrolled/:userId', authenticateStudent, studentController.fetchEnrolledCourses.bind(studentController));
studentRouter.get('/enrollment/:courseId', authenticateStudent, studentController.getEnrollment.bind(studentController));
studentRouter.get('/enrolled/:userId', (req, res) => {
    // Nuclear cache prevention
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Vary': '*'
    });
    
    console.log('🔥 TEST ROUTE HIT', req.params.userId, req.query);
    res.json({ 
      working: true,
      timestamp: Date.now() // Dynamic value prevents caching
    });
  });
studentRouter.post('/review/add/:courseId', authenticateStudent, studentController.updateReview.bind(studentController));
studentRouter.get('/review/get/:courseId', authenticateStudent, studentController.getStudentReview .bind(studentController));

export default studentRouter;