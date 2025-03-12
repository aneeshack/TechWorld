import { Request, Response } from "express";
import { IUser } from "../interfaces/database/IUser";
import { AdminRepository } from "../repository/adminRepository";
import { AdminService } from "../services/adminService";
import { IAdminService } from "../interfaces/admin/IAdminService";
import { paymentModel } from "../models/paymentModel";

export class AdminController{
    constructor(private adminService: IAdminService){}
    
    async instructorRequests(req: Request, res:Response):Promise<void>{
        try {
            const AllRequsts = await this.adminService.getAllRequsts()
            res.status(201).json({ success: true, data:AllRequsts });
        } catch (error:any) {
            res.status(400).json({success: false, message: error.message })
        }  
    }

    async rejectedInstructors(req: Request, res:Response):Promise<void>{
        try {
            const AllRequsts = await this.adminService.getAllRejectedRequests()
            res.status(201).json({ success: true, data:AllRequsts });
        } catch (error:any) {
            res.status(400).json({success: false, message: error.message })
        }  
    }

    async approveInstructor(req: Request, res:Response):Promise<void>{
        try {
            console.log('inside admin requests approved')
            const { userId }= req.params;
            const updatedUser = await this.adminService.approveRequest(userId)
            res.status(201).json({ success: true, message:"Instructor approved", updatedUser });
        } catch (error:any) {
            res.status(400).json({success: false, message: error.message })
        }  
    }

    async rejectInstructor(req: Request, res:Response):Promise<void>{
        try {
            console.log('inside admin requests rejected')
            const { userId }= req.params;
            const updatedUser = await this.adminService.rejecteRequest(userId)
            res.status(201).json({ success: true, message:"Instructor rejected", updatedUser });
        } catch (error:any) {
            res.status(400).json({success: false, message: error.message })
        }  
    }

    async getAllUsers(req: Request, res:Response):Promise<void> {
        try {
            const allUsers = await this.adminService.getAllUsers()
            res.status(200).json({success:true, data:allUsers})
        } catch (error:any) {
            res.status(400).json({success: false, message: error.message })
        }
    }

    async blockUser(req: Request, res:Response):Promise<void>{
        try {
            console.log('inside block user',req.params)
            const { userId } = req.params;
            const blockedUser = await this.adminService.blockUser(userId)
            res.status(201).json({ success:true, message:"user is blocked",blockedUser})
        } catch (error:any) {
            res.status(400).json({success: false, message: error.message })
        }
    }

    async unBlockUser(req: Request, res:Response):Promise<void>{
        try {
            const { userId } = req.params;
            const unblockedUser = await this.adminService.unBlockUser(userId)
            res.status(201).json({ success:true, message:"user is unblocked",unblockedUser})
        } catch (error:any) {
            res.status(400).json({success: false, message: error.message })
        }
    }

    async getPresignedUrl(req:Request, res: Response):Promise<void>{
        try {
            console.log('inside presigned url')
            const { fileName, fileType } = req.body
            console.log('req.body',fileName,fileType)
            const { presignedUrl, imageUrl} = await this.adminService.getPresignedUrl(fileName, fileType)

            res.json({ presignedUrl, imageUrl });
            
        } catch (error:any) {
            res.status(500).json({success: false, message: error.message});
        }
    }

    async addCategory(req:Request, res: Response):Promise<void>{
        try {
            console.log('add category')
            const { categoryName, description, imageUrl } = req.body
            console.log('req.body',req.body)
            if(!categoryName || !description || !imageUrl){
                 res.status(400).json({ success: false, message: "Invalid credentials" });
                 return
            }
            const newCategory = await this.adminService.createCategory(categoryName, description, imageUrl )

            if (!newCategory) {
                 res.status(500).json({ success: false, message: "Category creation failed" });
                 return
            }

            res.status(201).json({success:true, message:'Category added successfully',newCategory});
            
        } catch (error:any) {
            res.status(500).json({success: false, message: error.message});
        }
    }

    async getAllCategories(req:Request, res: Response):Promise<void>{
        try {
            const allCategories = await this.adminService.getAllCategories()
            console.log('all categories',allCategories)
            res.status(201).json({ success: true, data:allCategories });
        } catch (error:any) {
            res.status(400).json({success: false, message: error.message })
        }
    }

    async getSingleCategory(req:Request, res: Response):Promise<void>{
        try {

            const categoryId = req.params.categoryId;
            console.log('cat id',categoryId)
            const category = await this.adminService.getCategoryById(categoryId)

            console.log('category',category)
            res.status(200).json({ success: true, data:category });
        } catch (error:any) {
            res.status(400).json({success: false, message: error.message })
        }
    }

    async editCategory(req:Request, res: Response):Promise<void>{
        try {

            const categoryId = req.params.categoryId;
            console.log('category', categoryId)

            if(!categoryId){
                throw new Error('Category id not found')
            }
             
            const { categoryName, description, imageUrl} = req.body
            const updateCategory = await this.adminService.updateCategory(categoryId,{
                categoryName,
                description,
                imageUrl
            })

            console.log('category',updateCategory)
            res.status(200).json({ success: true, data:updateCategory });
        } catch (error:any) {
            res.status(400).json({success: false, message: error.message })
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
            console.log('inside presigned url for image')
          const { categoryId } = req.params;
          if(!categoryId){
            throw new Error('Category id not found')
          }
      
          const presignedUrl = await this.adminService.getPresignedUrlForCategoryImage(categoryId)
         
          console.log('presinged url',presignedUrl)
          res.json({ presignedUrl });
        } catch (error) {
          console.error("Error in InstructorController :get presigned url for video", error);
          res.status(500).json({ success: false, message: "Server error" });
        }
      }
}