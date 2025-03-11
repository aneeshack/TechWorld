import { IAdminRepository } from "../interfaces/admin/IAdminRepository";
import { CategoryEntity } from "../interfaces/courses/category";
import { IUser, RequestStatus } from "../interfaces/database/IUser";
import { Category } from "../models/categoryModel";
import UserModel from "../models/userModel";

export class AdminRepository implements IAdminRepository{
    async getAllRequests(): Promise<IUser[]> {
        try {
            const requests = await UserModel.find({role:'instructor', isRequested:true, requestStatus:'pending'})

            return requests
        } catch (error) {
            console.log("adminRepository error:getAllRequest", error);
            throw new Error(` ${(error as Error).message}`);
        }
    }

    async getAllRejectedRequests(): Promise<IUser[]> {
        try {
            const requests = await UserModel.find({role:'instructor', isRequested:true, requestStatus:RequestStatus.Rejected})

            return requests
        } catch (error) {
            console.log("adminRepository error:getAllRequest", error);
            throw new Error(` ${(error as Error).message}`);
        }
    }

    async approveRequest(userId: string): Promise<IUser> {
        try {
            const updateRequest = await UserModel.findByIdAndUpdate(userId,{requestStatus: RequestStatus.Approved},{new :true})
            console.log('updated data',updateRequest)
            if(!updateRequest){
                throw new Error('Error in update request')
            }

            return updateRequest
        } catch (error) {
            console.log("adminRepository error:approve request", error);
            throw new Error(`${(error as Error).message}`);
        }
    }

    async rejectRequest(userId: string): Promise<IUser> {
        try {
            const rejectUser = await UserModel.findByIdAndUpdate(userId,{requestStatus: RequestStatus.Rejected},{new :true})
            if( !rejectUser){
                throw new Error('user not found')
            }
            return rejectUser
        } catch (error) {
            console.log("adminRepository error:reject request", error);
            throw new Error(` ${(error as Error).message}`);
        }
    }

    async getAllUsers(): Promise<IUser[]> {
        try {
            const users = await UserModel.find({
                role:{$in:['instructor', 'student']},
                 $or:[{isGoogleAuth:true},{isOtpVerified:true}]
                })
                console.log('users',users)
            return users
        } catch (error) {
            console.log("adminRepository error: get all users", error);
            throw new Error(` ${(error as Error).message}`);
        }
    }

    async blockUser(userId: string): Promise<IUser> {
        try {
            const blockedUser = await UserModel.findByIdAndUpdate(userId,{$set:{isBlocked:true}},{new :true})
            if( !blockedUser){
                throw new Error('not find user')
            }
            return blockedUser
        } catch (error) {
            console.log("adminRepository error: block user", error);
            throw new Error(` ${(error as Error).message}`);
        }
    }

    async unblockUser(userId: string): Promise<IUser> {
        try {
            const unblockedUser = await UserModel.findByIdAndUpdate(userId,{$set:{isBlocked:false}},{new :true})
            if( !unblockedUser){
                throw new Error('not find user')
            }
            return unblockedUser
        } catch (error) {
            console.log("adminRepository error:unblock users", error);
            throw new Error(`Error in finding requests: ${(error as Error).message}`);
        }
    }

    async createCategory(categoryName: string, description: string, imageUrl: string):Promise<CategoryEntity|null>{
        try {
            const category =  new Category({categoryName, description, imageUrl}) 
            await category.save()
            return category
        } catch (error) {
            console.log("adminRepository error:unblock users", error);
            throw new Error(`Error in finding requests: ${(error as Error).message}`);
        }
    }

    async allCategories(): Promise<CategoryEntity[]> {
        try {
            const categories = await Category.find({isActive:true})

            return categories
        } catch (error) {
            console.log("adminRepository error:getAll categories", error);
            throw new Error(` ${(error as Error).message}`);
        }
    }

    async getCategoryById(categoryId: string): Promise<CategoryEntity> {
        try {
            const category = await Category.findById(categoryId)

            if(!category){
                throw new Error('category not found')
            }

            return category
        } catch (error) {
            console.log("adminRepository error:getAll category", error);
            throw new Error(` ${(error as Error).message}`);
        }
    }

    async updateCategory(categoryId:string, categoryData: Partial<CategoryEntity>): Promise<CategoryEntity> {
        try {
            const updatedCategory = await Category.findByIdAndUpdate(categoryId, 
                {$set: categoryData},
                {new :true}
            )

            if(!updatedCategory){
                throw new Error('category not found')
            }

            return updatedCategory
        } catch (error) {
            console.log("adminRepository error:getAll category", error);
            throw new Error(` ${(error as Error).message}`);
        }
    }
}