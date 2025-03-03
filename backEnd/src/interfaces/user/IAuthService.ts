import mongoose from "mongoose";
import { IUser, Role } from "./IUser";

export interface IAuthService{
    getUserById(userId: mongoose.Types.ObjectId): Promise<IUser |null>;
    signup(userData: Partial<IUser>): Promise<{ message: string }>;
    verifyOtp(email: string, otp: string):Promise<{message:string, token?:string, user?:Partial<IUser>}>;
    resendOtp(email: string):Promise<{message: string}>;
    loginAction(userData: Partial<IUser>): Promise<{ message: string, user?:Partial<IUser>, token?: string }>;
    register(userData: Partial<IUser>):Promise<{message: string, user?:Partial<IUser>}>;
    googleAuth(credentials: any, roleInput:Role):Promise<{ message: string, user?:Partial<IUser>, token?: string }>;
    forgotPassword(email: string, role:Role):Promise<{message: string}>;
    resetPassword(email: string, password: string, role:Role):Promise<{message: string}>;
    
}