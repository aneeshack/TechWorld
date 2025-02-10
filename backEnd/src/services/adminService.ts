import { IUser } from "../interfaces/user/IUser";
import { AdminRespository } from "../repository/adminRepository";


export class AdminService{
    constructor(private adminRepository: AdminRespository){}

     async getAllRequsts():Promise<IUser[]>{
        try {
            const requests = await this.adminRepository.getAllRequests();
            if(!requests){
                throw new Error('No requests find')
            }
            return requests
        } catch (error) {
            console.log('adminService error:get all requests',error)
            throw new Error(`${(error as Error).message}`)
        }
     }

     async approveRequest(userId: string):Promise<IUser |null>{
        try {
            const updatedUser = await this.adminRepository.approveRequest(userId);
            if(!updatedUser){
                throw new Error('User not found or already processed')
            }
            return updatedUser
        } catch (error) {
            console.log('adminService error: approve instructor',error)
            throw new Error(`${(error as Error).message}`)
        }
     }

     async rejecteRequest(userId: string):Promise<IUser |null>{
        try {
            const updatedUser = await this.adminRepository.rejectRequest(userId);
            if(!updatedUser){
                throw new Error('User not found or already processed')
            }
            return updatedUser
        } catch (error) {
            console.log('adminService error: reject instructor',error)
            throw new Error(`${(error as Error).message}`)
        }
     }
}