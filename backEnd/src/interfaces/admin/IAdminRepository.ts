import { CategoryEntity } from "../courses/category";
import { IUser } from "../database/IUser";

export interface IAdminRepository{
    getAllRequests():Promise<IUser[] >;
    approveRequest(userId: string):Promise<IUser | null>;
    rejectRequest(userId: string):Promise<IUser | null>;
    getAllRejectedRequests():Promise<IUser[]>;
    getAllUsers():Promise<IUser[]>;
    blockUser(userId: string):Promise<IUser | null>;
    unblockUser(userId: string):Promise<IUser| null>;
    createCategory(categoryName: string, description: string, imageUrl: string):Promise<CategoryEntity|null>;
    allCategories():Promise<CategoryEntity[] |null>;
    getCategoryById(categoryId: string): Promise<CategoryEntity>;
    updateCategory(categoryId:string, categoryData: Partial<CategoryEntity>): Promise<CategoryEntity | null>;

}

