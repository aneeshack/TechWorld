import { Request, Response } from "express";
import { IUser } from "../interfaces/user/IUser";
import { AdminRepository } from "../repository/adminRepository";
import { AdminService } from "../services/adminService";

export class AdminController{
    private adminService: AdminService;

    constructor(){
        this.adminService = new AdminService(new AdminRepository)
    }

    async instructorRequests(req: Request, res:Response):Promise<void>{
        try {
            const AllRequsts = await this.adminService.getAllRequsts()
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
}