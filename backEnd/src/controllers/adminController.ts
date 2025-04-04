import { Request, Response } from "express";
import { IAdminService } from "../interfaces/admin/IAdminService";
import { paymentModel } from "../models/paymentModel";
import { throwError } from "../middlewares/errorMiddleware";

export class AdminController{
    constructor(private _adminService: IAdminService){}
    
    async instructorRequests(req: Request, res:Response):Promise<void>{
        try {
            const allRequsts = await this._adminService.getAllRequsts()
            res.status(201).json({ success: true, data:allRequsts });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "An unexpected error occurred";
              res.status(400).json({ success:false, message: message })
          }
    }

    async rejectedInstructors(req: Request, res:Response):Promise<void>{
        try {
            
            const allRequsts = await this._adminService.getAllRejectedRequests()
            res.status(201).json({ success: true, data:allRequsts });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "An unexpected error occurred";
              res.status(400).json({ success:false, message: message })
          }
    }

    async approveInstructor(req: Request, res:Response):Promise<void>{
        try {
            const { userId }= req.params;
            const updatedUser = await this._adminService.approveRequest(userId)
            res.status(201).json({ success: true, message:"Instructor approved", updatedUser });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "An unexpected error occurred";
              res.status(400).json({ success:false, message: message })
          }
    }

    async rejectInstructor(req: Request, res:Response):Promise<void>{
        try {
            const { userId }= req.params;
            const updatedUser = await this._adminService.rejecteRequest(userId)
            res.status(201).json({ success: true, message:"Instructor rejected", updatedUser });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "An unexpected error occurred";
              res.status(400).json({ success:false, message: message })
          }
    }

    async getAllUsers(req: Request, res:Response):Promise<void> {
        try {
            const allUsers = await this._adminService.getAllUsers()
            res.status(200).json({success:true, data:allUsers})
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "An unexpected error occurred";
              res.status(400).json({ success:false, message: message })
          }
    }

    async blockUser(req: Request, res:Response):Promise<void>{
        try {
            const { userId } = req.params;
            const blockedUser = await this._adminService.blockUser(userId)
            res.status(201).json({ success:true, message:"user is blocked",blockedUser})
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "An unexpected error occurred";
              res.status(400).json({ success:false, message: message })
          }
    }

    async unBlockUser(req: Request, res:Response):Promise<void>{
        try {
            const { userId } = req.params;
            const unblockedUser = await this._adminService.unBlockUser(userId)
            res.status(201).json({ success:true, message:"user is unblocked",unblockedUser})
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "An unexpected error occurred";
              res.status(400).json({ success:false, message: message })
          }
    }

    async getPresignedUrl(req:Request, res: Response):Promise<void>{
        try {
            const { fileName, fileType } = req.body
            const { presignedUrl, imageUrl} = await this._adminService.getPresignedUrl(fileName, fileType)

            res.json({ presignedUrl, imageUrl });
            
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "An unexpected error occurred";
              res.status(400).json({ success:false, message: message })
          }
    }

    async addCategory(req:Request, res: Response):Promise<void>{
        try {
            const { categoryName, description, imageUrl } = req.body
            if(!categoryName || !description || !imageUrl){
                throwError(400, "All fields are required.");
            }
            const newCategory = await this._adminService.createCategory(categoryName, description, imageUrl )

            if (!newCategory) {
                throwError(500, "Error in creating new category.");
            }

            res.status(201).json({success:true, message:'Category added successfully',newCategory});
            
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "An unexpected error occurred";
              res.status(400).json({ success:false, message: message })
          }
    }

    async getAllCategories(req:Request, res: Response):Promise<void>{
        try {
            const allCategories = await this._adminService.getAllCategories()
            res.status(201).json({ success: true, data:allCategories });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "An unexpected error occurred";
              res.status(400).json({ success:false, message: message })
          }
    }

    async getSingleCategory(req:Request, res: Response):Promise<void>{
        try {

            const categoryId = req.params.categoryId;
            const category = await this._adminService.getCategoryById(categoryId)

            res.status(200).json({ success: true, data:category });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "An unexpected error occurred";
              res.status(400).json({ success:false, message: message })
          }
    }

    async editCategory(req:Request, res: Response):Promise<void>{
        try {

            const categoryId = req.params.categoryId;

            if(!categoryId){
                throwError(400, "All fields are required.");
            }
             
            const { categoryName, description, imageUrl} = req.body
            const updateCategory = await this._adminService.updateCategory(categoryId,{
                categoryName,
                description,
                imageUrl
            })

            res.status(200).json({ success: true, data:updateCategory });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "An unexpected error occurred";
              res.status(400).json({ success:false, message: message })
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
            res.status(500).json({ message: "Failed to fetch payments" });
          }
    }

    async getPresignedUrlForImage(req: Request, res: Response): Promise<void> {
        try {
          const { categoryId } = req.params;
          if(!categoryId){
            throwError(400,'Category id not found')
          }

      
          const presignedUrl = await this._adminService.getPresignedUrlForCategoryImage(categoryId)
         
          res.json({ presignedUrl });
        } catch (error) {
          console.error("Error in InstructorController :get presigned url for video", error);
          res.status(500).json({ success: false, message: "Server error" });
        }
      }
}