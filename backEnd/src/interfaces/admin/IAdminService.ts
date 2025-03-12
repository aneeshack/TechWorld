import { CategoryEntity } from "../courses/category";
import { IUser } from "../database/IUser";

export interface IAdminService{
    getAllRequsts():Promise<IUser[]>
    getAllRejectedRequests():Promise<IUser[]>;
    approveRequest(userId: string):Promise<IUser |null>;
    rejecteRequest(userId: string):Promise<IUser |null>;
    getAllUsers():Promise<IUser[]>;
    blockUser(userId: string):Promise<IUser |null>;
    unBlockUser(userId: string):Promise<IUser |null>;
    getPresignedUrl(fileName: string, fileType: string): Promise<{ presignedUrl: string; imageUrl: string }>;
    createCategory(categoryName: string, description: string, imageUrl: string):Promise<CategoryEntity |null>;
    getAllCategories():Promise<CategoryEntity[]>;
    getCategoryById(categoryId: string):Promise<CategoryEntity>;
    updateCategory(categoryId:string, categoryData: Partial<CategoryEntity>):Promise<CategoryEntity>;
    getPresignedUrlForCategoryImage(categoryId: string): Promise<string> ;
}