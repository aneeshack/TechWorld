import { IAdminRepository } from "../interfaces/admin/IAdminRepository";
import { IUser } from "../interfaces/user/IUser";
import { AdminRepository } from "../repository/adminRepository";


export class AdminService{
    constructor(private adminRepository: IAdminRepository){}
    // constructor(private adminRepository: AdminRepository){}

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

     async getAllUsers():Promise<IUser[]>{
        try {
            const users = await this.adminRepository.getAllUsers()
            if(!users){
                throw new Error('No user find')
            }
            return users
        } catch (error) {
            console.log('adminService error:get all users',error)
            throw new Error(`${(error as Error).message}`)
        }
     }

     async blockUser(userId: string):Promise<IUser |null>{
        try {
            const blockedUser = await this.adminRepository.blockUser(userId);
            if(!blockedUser){
                throw new Error('User is blocked')
            }
            return blockedUser
        } catch (error) {
            console.log('adminService error: block user',error)
            throw new Error(`${(error as Error).message}`)
        }
     }

     async unBlockUser(userId: string):Promise<IUser |null>{
        try {
            const unBlockUser = await this.adminRepository.unblockUser(userId);
            if(!unBlockUser){
                throw new Error('User is unblocked')
            }
            return unBlockUser
        } catch (error) {
            console.log('adminService error: unblocked user',error)
            throw new Error(`${(error as Error).message}`)
        }
     }
}