import { IUser } from "../user/IUser";

export interface IAdminRepository{
    getAllRequests():Promise<IUser[] >;
    approveRequest(userId: string):Promise<IUser | null>;
    rejectRequest(userId: string):Promise<IUser | null>;
    getAllUsers():Promise<IUser[]>;
    blockUser(userId: string):Promise<IUser | null>;
    unblockUser(userId: string):Promise<IUser| null>;
}

