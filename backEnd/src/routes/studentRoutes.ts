import { Router } from "express";

import { authenticateStudent } from "../middlewares/studentAuth";
import { StudentRepository } from "../repository/studentRepository";
import { StudentService } from "../services/studentService";
import { StudentController } from "../controllers/studentController";

const studentRouter = Router();
const studentRepository = new StudentRepository();
const studentService = new StudentService(studentRepository)
const studentController = new StudentController(studentService);


studentRouter.get('/profile/:userId',authenticateStudent, studentController.getProfile.bind(studentController));
studentRouter.put('/profile/:userId',authenticateStudent, studentController.updateProfile.bind(studentController));


export default studentRouter;