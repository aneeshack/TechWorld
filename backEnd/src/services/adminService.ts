import { PutObjectCommand } from "@aws-sdk/client-s3";
import { IAdminRepository } from "../interfaces/admin/IAdminRepository";
import { CategoryEntity } from "../interfaces/courses/category";
import { IUser } from "../interfaces/user/IUser";
import { AdminRepository } from "../repository/adminRepository";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from "../config/awsConfig";

export class AdminService{
    // constructor(private adminRepository: IAdminRepository){}
    constructor(private adminRepository: AdminRepository){}

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


    async getPresignedUrl(fileName: string, fileType: string): Promise<{ presignedUrl: string; imageUrl: string }> {
        try {
          const key = `categories/${Date.now()}-${fileName}`;
    
          const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
            ContentType: fileType,
          });
    
          // Generate a signed URL for uploading
          const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    
          // Construct the final image URL
          const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    
          console.log('Generated Image URL:', imageUrl);
          return { presignedUrl, imageUrl };
        } catch (error) {
          console.error('S3Service Error: Presigned URL generation failed', error);
          throw new Error(`Error generating presigned URL: ${(error as Error).message}`);
        }
      }

     async createCategory(categoryName: string, description: string, imageUrl: string):Promise<CategoryEntity |null>{
        try {

            const newCategory = await this.adminRepository.createCategory(categoryName, description, imageUrl);
            if(!newCategory){
                throw new Error('User not found or already processed')
            }
            return newCategory
        } catch (error) {
            console.log('adminService error: approve instructor',error)
            throw new Error(`${(error as Error).message}`)
        }
     }

     async getAllCategories():Promise<CategoryEntity[]>{
        try {
            const categories = await this.adminRepository.allCategories();
            if(!categories){
                throw new Error('No categories found')
            }
            return categories
        } catch (error) {
            console.log('adminService error:get all categories',error)
            throw new Error(`${(error as Error).message}`)
        }
     }

     async getCategoryById(categoryId: string):Promise<CategoryEntity>{
        try {
            const category = await this.adminRepository.getCategoryById(categoryId);
            if(!category){
                throw new Error('No category found')
            }
            return category
        } catch (error) {
            console.log('adminService error:get all category',error)
            throw new Error(`${(error as Error).message}`)
        }
     }

     async updateCategory(categoryId:string, categoryData: Partial<CategoryEntity>):Promise<CategoryEntity>{
        try {
            const updateCategory = await this.adminRepository.updateCategory(categoryId,categoryData);
            if(!updateCategory){
                throw new Error('No category found, update failed')
            }
            return updateCategory
        } catch (error) {
            console.log('adminService error:get all category',error)
            throw new Error(`${(error as Error).message}`)
        }
     }
}