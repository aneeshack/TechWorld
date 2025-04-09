import { Request, Response } from "express";
import { IAdminService } from "../interfaces/admin/IAdminService";
import { paymentModel } from "../models/paymentModel";
import { throwError } from "../middlewares/errorMiddleware";
import { HTTP_STATUS, MESSAGES } from "../constants/httpStatus";

export class AdminController{
    constructor(private _adminService: IAdminService){}
    
    async instructorRequests(req: Request, res:Response):Promise<void>{
        try {

            const allRequsts = await this._adminService.getAllRequsts()
            res.status(HTTP_STATUS.OK).json({ success: true, data:allRequsts });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : MESSAGES.GENERIC_ERROR;
              res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
          }
    }

    async rejectedInstructors(req: Request, res:Response):Promise<void>{
        try { 
         
            const allRequsts = await this._adminService.getAllRejectedRequests()
            res.status(HTTP_STATUS.OK).json({ success: true, data:allRequsts });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message :  MESSAGES.GENERIC_ERROR;
              res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
          }
    }

    async approveInstructor(req: Request, res:Response):Promise<void>{
        try {
            const { userId }= req.params;
            const updatedUser = await this._adminService.approveRequest(userId)
            res.status(HTTP_STATUS.OK).json({ success: true, message:MESSAGES.INSTRUCTOR_APPROVED, updatedUser });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message :  MESSAGES.GENERIC_ERROR;
              res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
          }
    }

    async rejectInstructor(req: Request, res:Response):Promise<void>{
        try {
            const { userId }= req.params;
            const updatedUser = await this._adminService.rejecteRequest(userId)
            res.status(HTTP_STATUS.OK).json({ success: true, message:MESSAGES.INSTRUCTOR_REJECTED, updatedUser });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message :  MESSAGES.GENERIC_ERROR;
              res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
          }
    }

    async getAllUsers(req: Request, res:Response):Promise<void> {
        try {
            const allUsers = await this._adminService.getAllUsers()
            res.status(200).json({success:true, data:allUsers})
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message :  MESSAGES.GENERIC_ERROR;
              res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
          }
    }

    async blockUser(req: Request, res:Response):Promise<void>{
        try {
            const { userId } = req.params;
            const blockedUser = await this._adminService.blockUser(userId)
            res.status(HTTP_STATUS.OK).json({ success:true, message:MESSAGES.USER_BLOCKED,blockedUser})
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message :  MESSAGES.GENERIC_ERROR;
              res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
          }
    }

    async unBlockUser(req: Request, res:Response):Promise<void>{
        try {
            const { userId } = req.params;
            const unblockedUser = await this._adminService.unBlockUser(userId)
            res.status(HTTP_STATUS.OK).json({ success:true, message:MESSAGES.USER_UNBLOCKED,unblockedUser})
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message :  MESSAGES.GENERIC_ERROR;
              res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
          }
    }

    async getPresignedUrl(req:Request, res: Response):Promise<void>{
        try {
            const { fileName, fileType } = req.body
            const { presignedUrl, imageUrl} = await this._adminService.getPresignedUrl(fileName, fileType)

            res.json({ presignedUrl, imageUrl });
            
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message :  MESSAGES.GENERIC_ERROR;
              res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
          }
    }

    async addCategory(req:Request, res: Response):Promise<void>{
        try {
            const { categoryName, description, imageUrl } = req.body
            if(!categoryName || !description || !imageUrl){
                throwError(HTTP_STATUS.BAD_REQUEST,MESSAGES.REQUIRED );
            }
            const newCategory = await this._adminService.createCategory(categoryName, description, imageUrl )

            if (!newCategory) {
                throwError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Error in creating new category.");
            }

            res.status(HTTP_STATUS.CREATED).json({success:true, message:MESSAGES.CATEGORY_CREATED,newCategory});
            
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message :  MESSAGES.GENERIC_ERROR;
              res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
          }
    }

    async getAllCategories(req:Request, res: Response):Promise<void>{
        try {
            const allCategories = await this._adminService.getAllCategories()
            res.status(HTTP_STATUS.OK).json({ success: true, data:allCategories });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message :  MESSAGES.GENERIC_ERROR;
              res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
          }
    }

    async getSingleCategory(req:Request, res: Response):Promise<void>{
        try {

            const categoryId = req.params.categoryId;
            const category = await this._adminService.getCategoryById(categoryId)

            res.status(HTTP_STATUS.OK).json({ success: true, data:category });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message :  MESSAGES.GENERIC_ERROR;
              res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
          }
    }

    async editCategory(req:Request, res: Response):Promise<void>{
        try {

            const categoryId = req.params.categoryId;

            if(!categoryId){
                throwError(HTTP_STATUS.BAD_REQUEST, MESSAGES.REQUIRED);
            }
             
            const { categoryName, description, imageUrl} = req.body
            const updateCategory = await this._adminService.updateCategory(categoryId,{
                categoryName,
                description,
                imageUrl
            })

            res.status(HTTP_STATUS.OK).json({ success: true, data:updateCategory });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message :  MESSAGES.GENERIC_ERROR;
              res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success:false, message: message })
          }
    }


    async fetchPayments(req:Request, res: Response):Promise<void>{
        try {
            const payments = await paymentModel
              .find()
              .populate("userId", " userName email") // Populating user details
              .populate("courseId", "title price") // Populating course details
              .sort({ createdAt: -1 }); // Sorting by most recent transactions
        
            res.json({ payments });
          } catch (error) {
            console.error("Error fetching payments:", error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch payments" });
          }
    }

    async getPresignedUrlForImage(req: Request, res: Response): Promise<void> {
        try {
          const { categoryId } = req.params;
          if(!categoryId){
            throwError(HTTP_STATUS.BAD_REQUEST,'Category id not found')
          }

      
          const presignedUrl = await this._adminService.getPresignedUrlForCategoryImage(categoryId)
         
          res.json({ presignedUrl });
        } catch (error) {
          console.error("Error in InstructorController :get presigned url for video", error);
          res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: "Server error" });
        }
      }
}