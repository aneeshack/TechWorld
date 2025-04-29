import { Router } from "express";
import { InstructorController } from "../controllers/InstructorController";
import { InstructorRepository } from "../repository/instructorRepository";
import { InstructorService } from "../services/instructorService";
import { authenticateInstructor } from "../middlewares/instructorAuth";
import s3Service from "../services/s3ServiceInstance";

const instructorRouter = Router();
const instructorRepository = new InstructorRepository();
export const instructorService = new InstructorService(instructorRepository,s3Service);
const instructorController = new InstructorController(instructorService)

instructorRouter.get('/fetchCategories',authenticateInstructor, instructorController.fetchCategories.bind(instructorController));
instructorRouter.get('/allCourses',authenticateInstructor, instructorController.fetchAllCourses.bind(instructorController));
instructorRouter.get('/course/:courseId',authenticateInstructor, instructorController.fetchSingleCourse.bind(instructorController));
instructorRouter.post('/course/add',authenticateInstructor, instructorController.createCourse.bind(instructorController));
instructorRouter.put('/course/edit/:courseId',authenticateInstructor, instructorController.updateCourse.bind(instructorController));
instructorRouter.patch('/course/publish/:courseId',authenticateInstructor, instructorController.publishCourse.bind(instructorController));


instructorRouter.post('/lesson/getPresignedUrl', authenticateInstructor, instructorController.getPresignedUrl.bind(instructorController));
instructorRouter.post('/lesson/add',authenticateInstructor, instructorController.addLesson.bind(instructorController));
instructorRouter.get('/lessons/:courseId',authenticateInstructor, instructorController.fetchAllLessons.bind(instructorController));
instructorRouter.get('/lesson/:lessonId',authenticateInstructor, instructorController.fetchSingleLesson.bind(instructorController));
instructorRouter.put('/lesson/:lessonId',authenticateInstructor, instructorController.updateLesson.bind(instructorController));
instructorRouter.post('/lesson/:lessonId/assessment',authenticateInstructor, instructorController.addOrUpdateAssessment.bind(instructorController));
instructorRouter.get('/lesson/getPresignedUrlForVideo/:lessonId',authenticateInstructor, instructorController.presSignedUrlForVideo.bind(instructorController));


instructorRouter.get('/profile/:userId',authenticateInstructor, instructorController.getInstructorProfile.bind(instructorController));
instructorRouter.put('/profile/:userId',authenticateInstructor, instructorController.updateProfile.bind(instructorController));



instructorRouter.post('/course/:courseId/finalAssessment',authenticateInstructor, instructorController.addAssessment.bind(instructorController));

export default instructorRouter;