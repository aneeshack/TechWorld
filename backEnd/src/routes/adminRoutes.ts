import { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { validateUserId } from "../middlewares/validateUserId";
import { handleValidationErrors } from "../middlewares/handleValidationErrors";
import { authenticateUser } from "../middlewares/authMiddleware";

const adminRouter = Router();
const adminController = new AdminController();

adminRouter.get('/instructorRequests',authenticateUser, adminController.instructorRequests.bind(adminController));
adminRouter.patch('/request/approve/:userId', authenticateUser, validateUserId,handleValidationErrors, adminController.approveInstructor.bind(adminController));
adminRouter.patch('/request/reject/:userId', authenticateUser, validateUserId,handleValidationErrors, adminController.rejectInstructor.bind(adminController));
adminRouter.get('/users', authenticateUser, adminController.getAllUsers.bind(adminController));
adminRouter.patch('/user/block/:userId',authenticateUser, validateUserId,handleValidationErrors, adminController.blockUser.bind(adminController));
adminRouter.patch('/user/unblock/:userId', authenticateUser, validateUserId,handleValidationErrors, adminController.unBlockUser.bind(adminController));


adminRouter.post('/category/get-presigned-url', authenticateUser, adminController.getPresignedUrl.bind(adminController));
adminRouter.post('/category/add', authenticateUser, adminController.addCategory.bind(adminController));
adminRouter.get('/category/add', authenticateUser, adminController.addCategory.bind(adminController));
adminRouter.get('/categories', authenticateUser, adminController.getAllCategories.bind(adminController));
adminRouter.get('/category/:categoryId', authenticateUser, adminController.getSingleCategory.bind(adminController));
adminRouter.put('/category/update/:categoryId', authenticateUser, adminController.editCategory.bind(adminController));


export default adminRouter