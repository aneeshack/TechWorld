import { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { validateUserId } from "../middlewares/validateUserId";
import { handleValidationErrors } from "../middlewares/handleValidationErrors";
import { authenticateUser } from "../middlewares/authMiddleware";
import { AdminRepository } from "../repository/adminRepository";
import { AdminService } from "../services/adminService";
import { authenticateAdmin } from "../middlewares/adminAuth";

const adminRouter = Router();
const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository);
const adminController = new AdminController(adminService);

adminRouter.get('/instructorRequests',authenticateAdmin, adminController.instructorRequests.bind(adminController));
adminRouter.get('/instructorRequests/rejected',authenticateAdmin, adminController.rejectedInstructors.bind(adminController));
adminRouter.patch('/request/approve/:userId', authenticateAdmin, validateUserId,handleValidationErrors, adminController.approveInstructor.bind(adminController));
adminRouter.patch('/request/reject/:userId', authenticateAdmin, validateUserId,handleValidationErrors, adminController.rejectInstructor.bind(adminController));
adminRouter.get('/users', authenticateAdmin, adminController.getAllUsers.bind(adminController));
adminRouter.patch('/user/block/:userId',authenticateAdmin, validateUserId,handleValidationErrors, adminController.blockUser.bind(adminController));
adminRouter.patch('/user/unblock/:userId', authenticateAdmin, validateUserId,handleValidationErrors, adminController.unBlockUser.bind(adminController));


adminRouter.post('/category/get-presigned-url', authenticateAdmin, adminController.getPresignedUrl.bind(adminController));
adminRouter.post('/category/add', authenticateAdmin, adminController.addCategory.bind(adminController));
adminRouter.get('/category/add', authenticateAdmin, adminController.addCategory.bind(adminController));
adminRouter.get('/categories', authenticateAdmin, adminController.getAllCategories.bind(adminController));
adminRouter.get('/category/:categoryId', authenticateAdmin, adminController.getSingleCategory.bind(adminController));
adminRouter.put('/category/update/:categoryId', authenticateAdmin, adminController.editCategory.bind(adminController));


export default adminRouter;