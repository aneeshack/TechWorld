import { Router } from "express";
import { AdminController } from "../controllers/adminController";

const adminRouter = Router();
const adminController = new AdminController();

adminRouter.get('/instructorRequests', adminController.instructorRequests.bind(adminController));
adminRouter.patch('/request/approve/:userId', adminController.approveInstructor.bind(adminController));
adminRouter.patch('/request/reject/:userId', adminController.rejectInstructor.bind(adminController));


export default adminRouter