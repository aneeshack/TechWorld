import { IAdminRepository } from "../interfaces/admin/IAdminRepository";
import { CategoryEntity } from "../interfaces/courses/category";
import { IUser } from "../interfaces/database/IUser";
import S3Service from "./s3Service";

export class AdminService{

    private _adminRepository: IAdminRepository;
  private _s3Service: S3Service; 

  constructor(adminRepository: IAdminRepository, s3Service: S3Service) {
    this._adminRepository = adminRepository;
    this._s3Service = s3Service;
  }

     async getAllRequsts():Promise<IUser[]>{
        try {
            const requests = await this._adminRepository.getAllRequests();
            if(!requests){
                throw new Error('No requests find')
            }
            return requests
        } catch (error) {
            console.error('adminService error:get all requests',error)
            throw new Error(`${(error as Error).message}`)
        }
     }


     async getAllRejectedRequests():Promise<IUser[]>{
        try {
            const requests = await this._adminRepository.getAllRejectedRequests();
            if(!requests){
                throw new Error('No requests find')
            }
            return requests
        } catch (error) {
            console.error('adminService error:get all requests',error)
            throw new Error(`${(error as Error).message}`)
        }
     }

     async approveRequest(userId: string):Promise<IUser |null>{
        try {
            const updatedUser = await this._adminRepository.approveRequest(userId);
            if(!updatedUser){
                throw new Error('User not found or already processed')
            }
            return updatedUser
        } catch (error) {
            console.error('adminService error: approve instructor',error)
            throw new Error(`${(error as Error).message}`)
        }
     }

     async rejecteRequest(userId: string):Promise<IUser |null>{
        try {
            const updatedUser = await this._adminRepository.rejectRequest(userId);
            if(!updatedUser){
                throw new Error('User not found or already processed')
            }
            return updatedUser
        } catch (error) {
            console.error('adminService error: reject instructor',error)
            throw new Error(`${(error as Error).message}`)
        }
     }

     async getAllUsers():Promise<IUser[]>{
        try {
            const users = await this._adminRepository.getAllUsers()
            if(!users){
                throw new Error('No user find')
            }
            return users
        } catch (error) {
            console.error('adminService error:get all users',error)
            throw new Error(`${(error as Error).message}`)
        }
     }

     async blockUser(userId: string):Promise<IUser |null>{
        try {
            const blockedUser = await this._adminRepository.blockUser(userId);
            if(!blockedUser){
                throw new Error('User is blocked')
            }
            return blockedUser
        } catch (error) {
            console.error('adminService error: block user',error)
            throw new Error(`${(error as Error).message}`)
        }
     }

     async unBlockUser(userId: string):Promise<IUser |null>{
        try {
            const unBlockUser = await this._adminRepository.unblockUser(userId);
            if(!unBlockUser){
                throw new Error('User is unblocked')
            }
            return unBlockUser
        } catch (error) {
            console.error('adminService error: unblocked user',error)
            throw new Error(`${(error as Error).message}`)
        }
     }

    async getPresignedUrl(fileName: string, fileType: string): Promise<{ presignedUrl: string; imageUrl: string }> {
        try {
          const key = `categories/${Date.now()}-${encodeURIComponent(fileName)}`;
          const { presignedUrl, videoUrl: imageUrl } = await this._s3Service.generatePresignedUrlForUpload(key, fileType, 60); // Reuse S3Service method
          console.log("Generated Image URL:", imageUrl); // Changed to log instead of error
          return { presignedUrl, imageUrl };
        } catch (error) {
          console.error("AdminService Error: Presigned URL generation failed", error);
          throw new Error(`Error generating presigned URL: ${(error as Error).message}`);
        }
      }

     async createCategory(categoryName: string, description: string, imageUrl: string):Promise<CategoryEntity |null>{
        try {

            const newCategory = await this._adminRepository.createCategory(categoryName, description, imageUrl);
            if(!newCategory){
                throw new Error('User not found or already processed')
            }
            return newCategory
        } catch (error) {
            console.error('adminService error: approve instructor',error)
            throw new Error(`${(error as Error).message}`)
        }
     }

     async getAllCategories():Promise<CategoryEntity[]>{
        try {
            const categories = await this._adminRepository.allCategories();
            if(!categories){
                throw new Error('No categories found')
            }
            return categories
        } catch (error) {
            console.error('adminService error:get all categories',error)
            throw new Error(`${(error as Error).message}`)
        }
     }

     async getCategoryById(categoryId: string):Promise<CategoryEntity>{
        try {
            const category = await this._adminRepository.getCategoryById(categoryId);
            if(!category){
                throw new Error('No category found')
            }
            return category
        } catch (error) {
            console.error('adminService error:get all category',error)
            throw new Error(`${(error as Error).message}`)
        }
     }

     async updateCategory(categoryId:string, categoryData: Partial<CategoryEntity>):Promise<CategoryEntity>{
        try {
            const updateCategory = await this._adminRepository.updateCategory(categoryId,categoryData);
            if(!updateCategory){
                throw new Error('No category found, update failed')
            }
            return updateCategory
        } catch (error) {
            console.error('adminService error:get all category',error)
            throw new Error(`${(error as Error).message}`)
        }
     }
   
    async getPresignedUrlForCategoryImage(categoryId: string): Promise<string> {
        try {
          const category = await this._adminRepository.getCategoryById(categoryId);
          if (!category) {
            throw new Error("No category found");
          }
          const imageUrl = category.imageUrl || "";
          const imageKey = imageUrl.split(".amazonaws.com/")[1];
    
          if (!imageKey) {
            throw new Error("Invalid S3 URL format");
          }
    
          const presignedUrl = await this._s3Service.generatePresignedUrl(imageKey, 300); // Reuse S3Service method
          return presignedUrl;
        } catch (error) {
          console.error("Error generating presigned URL for category image:", error);
          throw new Error(`Failed to generate presigned URL: ${(error as Error).message}`);
        }
      }
}