import { Request, Response } from "express";
import { IUser } from "../interfaces/user/IUser";
import { AdminRespository } from "../repository/adminRepository";
import { AdminService } from "../services/adminService";

export class AdminController{
    private adminService: AdminService;

    constructor(){
        this.adminService = new AdminService(new AdminRespository)
    }

    async instructorRequests(req: Request, res:Response):Promise<void>{
        try {
            const AllRequsts = await this.adminService.getAllRequsts()
            res.status(201).json({ success: true, data:AllRequsts });
        } catch (error:any) {
            res.status(400).json({ message: error.message })
        }  
    }

    async approveInstructor(req: Request, res:Response):Promise<void>{
        try {
            console.log('inside admin requests approved')
            const { userId }= req.params;
            const updatedUser = await this.adminService.approveRequest(userId)
            res.status(201).json({ success: true, message:"Instructor approved", data:updatedUser });
        } catch (error:any) {
            res.status(400).json({ message: error.message })
        }  
    }
}