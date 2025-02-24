import { Router } from "express";
import { InstructorController } from "../controllers/InstructorController";
import { authenticateUser } from "../middlewares/authMiddleware";

const instructorRouter = Router();
const instructorController = new InstructorController();

instructorRouter.get('/fetchCategories',authenticateUser, instructorController.fetchCategories.bind(instructorController));
instructorRouter.get('/allCourses',authenticateUser, instructorController.fetchAllCourses.bind(instructorController));
instructorRouter.get('/course/:courseId',authenticateUser, instructorController.fetchSingleCourse.bind(instructorController));
instructorRouter.post('/course/add',authenticateUser, instructorController.createCourse.bind(instructorController));
instructorRouter.put('/course/edit/:courseId',authenticateUser, instructorController.updateCourse.bind(instructorController));
instructorRouter.patch('/course/publish/:courseId',authenticateUser, instructorController.publishCourse.bind(instructorController));


instructorRouter.post('/lesson/getPresignedUrl', authenticateUser, instructorController.getPresignedUrl.bind(instructorController));
instructorRouter.post('/lesson/add',authenticateUser, instructorController.addLesson.bind(instructorController));
instructorRouter.get('/lessons/:courseId',authenticateUser, instructorController.fetchAllLessons.bind(instructorController));
instructorRouter.get('/lesson/:lessonId',authenticateUser, instructorController.fetchSingleLesson.bind(instructorController));
instructorRouter.put('/lesson/:lessonId',authenticateUser, instructorController.updateLesson.bind(instructorController));

// instructorRouter.put('/lesson/edit/:lessonId',authenticateUser, instructorController.editLesson.bind(instructorController));
// instructorRouter.post('/assessment/add',authenticateUser, instructorController.addAssessment.bind(instructorController));
// instructorRouter.put('/assessment/edit/:assessmentId',authenticateUser, instructorController.updateAssessment.bind(instructorController));


export default instructorRouter;